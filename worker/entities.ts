import { IndexedEntity } from "./core-utils";
import type { User, Sponsor, Center, Researcher, ProjectCode, WorkPerformed, SdcTrackingEntry, SdcWorkPerformedItem } from "@shared/types";
import { MOCK_SPONSORS, MOCK_CENTERS, MOCK_RESEARCHERS, MOCK_PROJECT_CODES, MOCK_WORK_PERFORMED, MOCK_SDC_TRACKING_ENTRIES, MOCK_SDC_WORK_PERFORMED_ITEMS } from "@shared/mock-data";
// The immutable Super Admin user.
const SUPER_ADMIN_USER: User = {
  id: 'user-001',
  username: 'MLS',
  password: '2008', // In a real app, this would be a hashed password.
  role: 'Level 3',
  createdAt: '2023-01-15T10:00:00Z',
};
// USER ENTITY
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", username: "", role: 'Level 1', createdAt: '' };
  static seedData: ReadonlyArray<User> = [SUPER_ADMIN_USER];
  async getPublicProfile(): Promise<Omit<User, 'password'>> {
    const user = await this.getState();
    const { password, ...publicProfile } = user;
    return publicProfile;
  }
}
// SPONSOR ENTITY
export class SponsorEntity extends IndexedEntity<Sponsor> {
  static readonly entityName = "sponsor";
  static readonly indexName = "sponsors";
  static readonly initialState: Sponsor = { id: "", name: "", contactPerson: "", email: "", status: 'Inactive' };
  static seedData: ReadonlyArray<Sponsor> = MOCK_SPONSORS;
}
// CENTER ENTITY
export class CenterEntity extends IndexedEntity<Center> {
  static readonly entityName = "center";
  static readonly indexName = "centers";
  static readonly initialState: Center = { id: "", name: "", location: "", primaryContact: "", status: 'Inactive' };
  static seedData: ReadonlyArray<Center> = MOCK_CENTERS;
}
// RESEARCHER ENTITY
export class ResearcherEntity extends IndexedEntity<Researcher> {
  static readonly entityName = "researcher";
  static readonly indexName = "researchers";
  static readonly initialState: Researcher = { id: "", name: "", specialty: "", centerId: "", email: "" };
  static seedData: ReadonlyArray<Researcher> = MOCK_RESEARCHERS;
}
// PROJECT CODE ENTITY
export class ProjectCodeEntity extends IndexedEntity<ProjectCode> {
  static readonly entityName = "projectCode";
  static readonly indexName = "projectCodes";
  static readonly initialState: ProjectCode = { id: "", code: "", description: "", sponsorId: "", status: 'On Hold' };
  static seedData: ReadonlyArray<ProjectCode> = MOCK_PROJECT_CODES;
}
// WORK PERFORMED ENTITY
export class WorkPerformedEntity extends IndexedEntity<WorkPerformed> {
  static readonly entityName = "workPerformed";
  static readonly indexName = "workPerformed";
  static readonly initialState: WorkPerformed = { id: "", name: "", description: "", status: 'Pending' };
  static seedData: ReadonlyArray<WorkPerformed> = MOCK_WORK_PERFORMED;
}
// SDC TRACKING ENTRY ENTITY
export class SdcTrackingEntryEntity extends IndexedEntity<SdcTrackingEntry> {
  static readonly entityName = "sdcTrackingEntry";
  static readonly indexName = "sdcTrackingEntries";
  static readonly initialState: SdcTrackingEntry = { id: "", sdcPersonnelFirstName: "", sdcPersonnelLastName: "", patientCode: "", date: "", sponsorId: "", centerId: "", researcherId: "", projectCodeId: "", startTime: "", endTime: "", createdBy: "" };
  static seedData: ReadonlyArray<SdcTrackingEntry> = MOCK_SDC_TRACKING_ENTRIES;
}
// SDC WORK PERFORMED ITEM ENTITY
export class SdcWorkPerformedItemEntity extends IndexedEntity<SdcWorkPerformedItem> {
  static readonly entityName = "sdcWorkPerformedItem";
  static readonly indexName = "sdcWorkPerformedItems";
  static readonly initialState: SdcWorkPerformedItem = { id: "", sdcTrackingEntryId: "", name: "", startTime: "", endTime: "", notes: "" };
  static seedData: ReadonlyArray<SdcWorkPerformedItem> = MOCK_SDC_WORK_PERFORMED_ITEMS;
}