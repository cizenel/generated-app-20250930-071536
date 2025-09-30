import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, SponsorEntity, CenterEntity, ResearcherEntity, ProjectCodeEntity, WorkPerformedEntity, SdcTrackingEntryEntity, SdcWorkPerformedItemEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, Sponsor, Center, Researcher, ProjectCode, WorkPerformed, SdcTrackingEntry, SdcWorkPerformedItem } from "@shared/types";
import { IndexedEntity, Index } from "./core-utils";
// Type for a constructible IndexedEntity class
type IndexedEntityConstructor<T extends { id: string }> = (new (env: Env, id: string) => IndexedEntity<T>) & typeof IndexedEntity<T>;
// Generic CRUD route creator for Definition entities
function createCrudRoutes<T extends { id: string }>(
  app: Hono<{ Bindings: Env }>,
  path: string,
  Entity: IndexedEntityConstructor<T>
) {
  // Ensure seed data
  app.use(`${path}/*`, async (c, next) => {
    await Entity.ensureSeed(c.env);
    await next();
  });
  // List all
  app.get(path, async (c) => {
    const page = await Entity.list(c.env);
    return ok(c, page);
  });
  // Create new
  app.post(path, async (c) => {
    const body = await c.req.json<Partial<T>>();
    const newEntity: T = {
      id: crypto.randomUUID(),
      ...body,
    } as T;
    await Entity.create(c.env, newEntity);
    return ok(c, newEntity);
  });
  // Get one
  app.get(`${path}/:id`, async (c) => {
    const id = c.req.param('id');
    const entity = new Entity(c.env, id);
    if (!await entity.exists()) {
      return notFound(c, 'Entity not found.');
    }
    return ok(c, await entity.getState());
  });
  // Update one
  app.put(`${path}/:id`, async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json<Partial<T>>();
    const entity = new Entity(c.env, id);
    if (!await entity.exists()) {
      return notFound(c, 'Entity not found.');
    }
    await entity.patch(updates);
    return ok(c, await entity.getState());
  });
  // Delete one
  app.delete(`${path}/:id`, async (c) => {
    const id = c.req.param('id');
    const deleted = await Entity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Entity not found.');
    }
    return ok(c, { id, deleted });
  });
}
// Generic count route creator
function createCountRoute(
  app: Hono<{ Bindings: Env }>,
  path: string,
  Entity: { indexName: string; ensureSeed: (env: Env) => Promise<void> }
) {
  app.get(path, async (c) => {
    await Entity.ensureSeed(c.env);
    const idx = new Index<string>(c.env, Entity.indexName);
    const items = await idx.list();
    return ok(c, { count: items.length });
  });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure Super Admin user is seeded on startup, idempotently.
  app.use('*', async (c, next) => {
    const superAdminId = 'user-001';
    const superAdminEntity = new UserEntity(c.env, superAdminId);
    if (!(await superAdminEntity.exists())) {
      // This uses the first item from seedData, which is the super admin.
      const superAdminData = UserEntity.seedData[0];
      await UserEntity.create(c.env, superAdminData);
    }
    await next();
  });
  // --- AUTHENTICATION ---
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json<{ username?: string; password?: string }>();
    if (!isStr(username) || !isStr(password)) {
      return bad(c, 'Username and password are required.');
    }
    const allUsers = await UserEntity.list(c.env);
    const userRecord = allUsers.items.find(u => u.username === username);
    if (!userRecord) {
      return notFound(c, 'Invalid credentials.');
    }
    const user = new UserEntity(c.env, userRecord.id);
    const fullUser = await user.getState();
    if (fullUser.password !== password) {
      return notFound(c, 'Invalid credentials.');
    }
    const { password: _, ...userToReturn } = fullUser;
    return ok(c, userToReturn);
  });
  // --- USERS CRUD ---
  app.get('/api/users', async (c) => {
    const page = await UserEntity.list(c.env);
    const usersWithoutPasswords = page.items.map(({ password, ...rest }) => rest);
    return ok(c, { ...page, items: usersWithoutPasswords });
  });
  app.post('/api/users', async (c) => {
    const { username, password, role } = await c.req.json<Partial<User>>();
    if (!isStr(username) || !isStr(password) || !isStr(role)) {
      return bad(c, 'Username, password, and role are required.');
    }
    if (!['Level 1', 'Level 2', 'Level 3'].includes(role)) {
        return bad(c, 'Invalid user role.');
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      username: username.trim(),
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    await UserEntity.create(c.env, newUser);
    const { password: _, ...userToReturn } = newUser;
    return ok(c, userToReturn);
  });
  app.get('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const user = new UserEntity(c.env, id);
    if (!await user.exists()) {
      return notFound(c, 'User not found.');
    }
    return ok(c, await user.getPublicProfile());
  });
  app.put('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const { username, role, password } = await c.req.json<Partial<User>>();
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) {
      return notFound(c, 'User not found.');
    }
    const updates: Partial<User> = {};
    if (isStr(username)) updates.username = username;
    if (isStr(role) && ['Level 1', 'Level 2', 'Level 3'].includes(role)) updates.role = role;
    if (isStr(password) && password) updates.password = password;
    await userEntity.patch(updates);
    return ok(c, await userEntity.getPublicProfile());
  });
  app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    if (id === 'user-001') {
        return bad(c, 'Super Admin cannot be deleted.');
    }
    const deleted = await UserEntity.delete(c.env, id);
    if (!deleted) {
        return notFound(c, 'User not found.');
    }
    return ok(c, { id, deleted });
  });
  // --- DEFINITIONS CRUD ---
  createCrudRoutes<Sponsor>(app, '/api/sponsors', SponsorEntity);
  createCrudRoutes<Center>(app, '/api/centers', CenterEntity);
  createCrudRoutes<Researcher>(app, '/api/researchers', ResearcherEntity);
  createCrudRoutes<ProjectCode>(app, '/api/project-codes', ProjectCodeEntity);
  createCrudRoutes<WorkPerformed>(app, '/api/work-performed', WorkPerformedEntity);
  // --- SDC TRACKING CRUD (with special permissions) ---
  app.use('/api/sdc-tracking/*', async (c, next) => {
    await SdcTrackingEntryEntity.ensureSeed(c.env);
    await SdcWorkPerformedItemEntity.ensureSeed(c.env);
    await next();
  });
  app.get('/api/sdc-tracking', async (c) => {
    const page = await SdcTrackingEntryEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/sdc-tracking', async (c) => {
    const body = await c.req.json<Partial<SdcTrackingEntry>>();
    const newEntity: SdcTrackingEntry = {
      id: crypto.randomUUID(),
      ...body,
    } as SdcTrackingEntry;
    await SdcTrackingEntryEntity.create(c.env, newEntity);
    return ok(c, newEntity);
  });
  app.put('/api/sdc-tracking/:id', async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json<Partial<SdcTrackingEntry>>();
    const entity = new SdcTrackingEntryEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Entity not found.');
    await entity.patch(updates);
    return ok(c, await entity.getState());
  });
  app.delete('/api/sdc-tracking/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await SdcTrackingEntryEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Entity not found.');
    // Also delete associated work items
    const allWorkItems = (await SdcWorkPerformedItemEntity.list(c.env)).items;
    const itemsToDelete = allWorkItems.filter(item => item.sdcTrackingEntryId === id).map(item => item.id);
    await SdcWorkPerformedItemEntity.deleteMany(c.env, itemsToDelete);
    return ok(c, { id, deleted });
  });
  // --- SDC WORK ITEMS Nested CRUD ---
  app.get('/api/sdc-tracking/:entryId/work-items', async (c) => {
    const entryId = c.req.param('entryId');
    const allItems = (await SdcWorkPerformedItemEntity.list(c.env)).items;
    const relatedItems = allItems.filter(item => item.sdcTrackingEntryId === entryId);
    return ok(c, relatedItems);
  });
  app.post('/api/sdc-tracking/:entryId/work-items', async (c) => {
    const entryId = c.req.param('entryId');
    const body = await c.req.json<Partial<SdcWorkPerformedItem>>();
    const newItem: SdcWorkPerformedItem = {
      id: crypto.randomUUID(),
      sdcTrackingEntryId: entryId,
      name: body.name || 'Unnamed Task',
      startTime: body.startTime || '00:00',
      endTime: body.endTime || '00:00',
      notes: body.notes || '',
    } as SdcWorkPerformedItem;
    await SdcWorkPerformedItemEntity.create(c.env, newItem);
    return ok(c, newItem);
  });
  app.delete('/api/sdc-tracking/:entryId/work-items/:itemId', async (c) => {
    const itemId = c.req.param('itemId');
    const deleted = await SdcWorkPerformedItemEntity.delete(c.env, itemId);
    if (!deleted) return notFound(c, 'Work item not found.');
    return ok(c, { id: itemId, deleted });
  });
  // --- STATS ---
  createCountRoute(app, '/api/stats/user-count', UserEntity);
  createCountRoute(app, '/api/stats/sponsor-count', SponsorEntity);
  createCountRoute(app, '/api/stats/center-count', CenterEntity);
  createCountRoute(app, '/api/stats/researcher-count', ResearcherEntity);
  createCountRoute(app, '/api/stats/project-code-count', ProjectCodeEntity);
  createCountRoute(app, '/api/stats/work-performed-count', WorkPerformedEntity);
  createCountRoute(app, '/api/stats/sdc-tracking-count', SdcTrackingEntryEntity);
}