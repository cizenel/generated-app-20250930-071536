import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { useAuthStore } from '@/stores/auth-store';
import { PlusCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { DataTableSkeleton } from '@/components/data-table/DataTableSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  createSponsorColumns,
  createCenterColumns,
  createResearcherColumns,
  createProjectCodeColumns,
  createWorkPerformedColumns,
} from '@/components/data-table/DataTableColumns';
import { DefinitionEntity } from '@shared/types';
import { DefinitionForm } from '@/components/DefinitionForm';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
type EntityType = 'sponsors' | 'centers' | 'researchers' | 'project-codes' | 'work-performed';
interface DefinitionsPageProps {
  entityType: EntityType;
}
const entityConfig = {
  sponsors: {
    title: 'Sponsors',
    description: 'Manage sponsor information.',
    columnsFactory: createSponsorColumns,
    filterColumnId: 'name',
    filterPlaceholder: 'Filter by name...',
    apiPath: '/api/sponsors',
  },
  centers: {
    title: 'Centers',
    description: 'Manage research center details.',
    columnsFactory: createCenterColumns,
    filterColumnId: 'name',
    filterPlaceholder: 'Filter by name...',
    apiPath: '/api/centers',
  },
  researchers: {
    title: 'Researchers',
    description: 'Manage researcher profiles.',
    columnsFactory: createResearcherColumns,
    filterColumnId: 'name',
    filterPlaceholder: 'Filter by name...',
    apiPath: '/api/researchers',
  },
  'project-codes': {
    title: 'Project Codes',
    description: 'Manage project codes and their statuses.',
    columnsFactory: createProjectCodeColumns,
    filterColumnId: 'code',
    filterPlaceholder: 'Filter by code...',
    apiPath: '/api/project-codes',
  },
  'work-performed': {
    title: 'Work Performed',
    description: 'Manage records of work performed.',
    columnsFactory: createWorkPerformedColumns,
    filterColumnId: 'name',
    filterPlaceholder: 'Filter by name...',
    apiPath: '/api/work-performed',
  },
};
export function DefinitionsPage({ entityType }: DefinitionsPageProps) {
  const { currentUser } = useAuthStore();
  const [data, setData] = useState<DefinitionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<DefinitionEntity | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<DefinitionEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const config = useMemo(() => entityConfig[entityType], [entityType]);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api<{ items: DefinitionEntity[] }>(config.apiPath);
      setData(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${config.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [config]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleFormSubmit = useCallback(async (values: any) => {
    setIsSubmitting(true);
    try {
      const singularTitle = config.title.endsWith('s') ? config.title.slice(0, -1) : config.title;
      if (editingEntity) {
        await api<DefinitionEntity>(`${config.apiPath}/${editingEntity.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success(`${singularTitle} updated successfully!`);
      } else {
        await api<DefinitionEntity>(config.apiPath, {
          method: 'POST',
          body: JSON.stringify(values),
        });
        toast.success(`${singularTitle} created successfully!`);
      }
      setIsSheetOpen(false);
      setEditingEntity(undefined);
      fetchData(); // Refetch data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      toast.error(`Operation failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingEntity, config, fetchData]);
  const handleAdd = useCallback(() => {
    setEditingEntity(undefined);
    setIsSheetOpen(true);
  }, []);
  const handleEdit = useCallback((entity: DefinitionEntity) => {
    setEditingEntity(entity);
    setIsSheetOpen(true);
  }, []);
  const handleDelete = useCallback((entity: DefinitionEntity) => {
    setEntityToDelete(entity);
  }, []);
  const confirmDelete = useCallback(async () => {
    if (!entityToDelete) return;
    setIsDeleting(true);
    try {
      const singularTitle = config.title.endsWith('s') ? config.title.slice(0, -1) : config.title;
      await api(`${config.apiPath}/${entityToDelete.id}`, { method: 'DELETE' });
      toast.success(`${singularTitle} deleted successfully!`);
      fetchData(); // Refetch data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      toast.error(`Deletion failed: ${errorMessage}`);
    } finally {
      setEntityToDelete(null);
      setIsDeleting(false);
    }
  }, [entityToDelete, config, fetchData]);
  const canAdd = currentUser?.role === 'Level 2' || currentUser?.role === 'Level 3';
  const singularTitle = config.title.endsWith('s') ? config.title.slice(0, -1) : config.title;
  const ActionButton = canAdd ? (
    <Button onClick={handleAdd}>
      <PlusCircle className="mr-2 h-4 w-4" /> Add {singularTitle}
    </Button>
  ) : null;
  const columns = useMemo(() => config.columnsFactory(handleEdit, handleDelete), [config, handleEdit, handleDelete]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <DataTableSkeleton columnCount={columns.length} rowCount={5} />
      ) : (
        <DataTable
          columns={columns as ColumnDef<DefinitionEntity, unknown>[]}
          data={data}
          filterColumnId={config.filterColumnId}
          filterPlaceholder={config.filterPlaceholder}
          actionButton={ActionButton}
          exportFileName={`mls_${entityType}`}
        />
      )}
      <DefinitionForm
        entityType={entityType}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleFormSubmit}
        defaultValues={editingEntity}
        isSubmitting={isSubmitting}
      />
      <AlertDialog open={!!entityToDelete} onOpenChange={() => setEntityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90" disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}