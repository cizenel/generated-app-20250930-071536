import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { useAuthStore } from '@/stores/auth-store';
import { PlusCircle, AlertCircle, Loader2, ListTodo } from 'lucide-react';
import { api } from '@/lib/api-client';
import { DataTableSkeleton } from '@/components/data-table/DataTableSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createSdcTrackingColumns } from '@/components/data-table/DataTableColumns';
import { SdcTrackingEntry, Sponsor, Center, Researcher, ProjectCode } from '@shared/types';
import { SdcTrackingForm } from '@/components/SdcTrackingForm';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SdcWorkItemsManager } from '@/components/SdcWorkItemsManager';
interface RelatedData {
  sponsors: Sponsor[];
  centers: Center[];
  researchers: Researcher[];
  projectCodes: ProjectCode[];
}
export function SdcTrackingPage() {
  const { currentUser } = useAuthStore();
  const [data, setData] = useState<SdcTrackingEntry[]>([]);
  const [relatedData, setRelatedData] = useState<RelatedData>({
    sponsors: [],
    centers: [],
    researchers: [],
    projectCodes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<SdcTrackingEntry | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<SdcTrackingEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [managingWorkItemsFor, setManagingWorkItemsFor] = useState<SdcTrackingEntry | null>(null);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        trackingRes,
        sponsorsRes,
        centersRes,
        researchersRes,
        projectCodesRes,
      ] = await Promise.all([
        api<{ items: SdcTrackingEntry[] }>('/api/sdc-tracking'),
        api<{ items: Sponsor[] }>('/api/sponsors'),
        api<{ items: Center[] }>('/api/centers'),
        api<{ items: Researcher[] }>('/api/researchers'),
        api<{ items: ProjectCode[] }>('/api/project-codes'),
      ]);
      setData(trackingRes.items);
      setRelatedData({
        sponsors: sponsorsRes.items,
        centers: centersRes.items,
        researchers: researchersRes.items,
        projectCodes: projectCodesRes.items,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch SDC tracking data.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleFormSubmit = useCallback(async (values: any) => {
    setIsSubmitting(true);
    try {
      if (editingEntity) {
        await api<SdcTrackingEntry>(`/api/sdc-tracking/${editingEntity.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success('SDC Tracking entry updated successfully!');
      } else {
        await api<SdcTrackingEntry>('/api/sdc-tracking', {
          method: 'POST',
          body: JSON.stringify({ ...values, createdBy: currentUser?.id }),
        });
        toast.success('SDC Tracking entry created successfully!');
      }
      setIsSheetOpen(false);
      setEditingEntity(undefined);
      fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      toast.error(`Operation failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingEntity, fetchData, currentUser]);
  const handleAdd = useCallback(() => {
    setEditingEntity(undefined);
    setIsSheetOpen(true);
  }, []);
  const handleEdit = useCallback((entity: SdcTrackingEntry) => {
    setEditingEntity(entity);
    setIsSheetOpen(true);
  }, []);
  const handleDelete = useCallback((entity: SdcTrackingEntry) => {
    setEntityToDelete(entity);
  }, []);
  const handleManageWorkItems = useCallback((entity: SdcTrackingEntry) => {
    setManagingWorkItemsFor(entity);
  }, []);
  const confirmDelete = useCallback(async () => {
    if (!entityToDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/sdc-tracking/${entityToDelete.id}`, { method: 'DELETE' });
      toast.success('SDC Tracking entry deleted successfully!');
      fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      toast.error(`Deletion failed: ${errorMessage}`);
    } finally {
      setEntityToDelete(null);
      setIsDeleting(false);
    }
  }, [entityToDelete, fetchData]);
  const canAdd = currentUser?.role === 'Level 2' || currentUser?.role === 'Level 3';
  const ActionButton = canAdd ? (
    <Button onClick={handleAdd}>
      <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
    </Button>
  ) : null;
  const columns = useMemo(() => createSdcTrackingColumns(handleEdit, handleDelete, handleManageWorkItems, relatedData), [handleEdit, handleDelete, handleManageWorkItems, relatedData]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display flex items-center gap-3">
          <ListTodo className="h-8 w-8 text-blue-600" />
          SDC Tracking List
        </h1>
        <p className="text-muted-foreground">Source Document Collection tracking and management.</p>
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
          columns={columns}
          data={data}
          filterColumnId="patientCode"
          filterPlaceholder="Filter by patient code..."
          actionButton={ActionButton}
          exportFileName="mls_sdc_tracking"
        />
      )}
      <SdcTrackingForm
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleFormSubmit}
        defaultValues={editingEntity}
        isSubmitting={isSubmitting}
        relatedData={relatedData}
      />
      <AlertDialog open={!!entityToDelete} onOpenChange={() => setEntityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SDC tracking record and all associated work items.
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
      {managingWorkItemsFor && (
        <SdcWorkItemsManager
          entry={managingWorkItemsFor}
          isOpen={!!managingWorkItemsFor}
          onOpenChange={() => setManagingWorkItemsFor(null)}
        />
      )}
    </div>
  );
}