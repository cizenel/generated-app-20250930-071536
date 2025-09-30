import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SdcTrackingEntry, SdcWorkPerformedItem } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, PlusCircle, Trash2, XCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
interface SdcWorkItemsManagerProps {
  entry: SdcTrackingEntry;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
const workItemSchema = z.object({
  name: z.string().min(2, "Task name is required."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  notes: z.string().optional(),
}).refine(data => {
    const start = new Date(`1970-01-01T${data.startTime}:00`);
    const end = new Date(`1970-01-01T${data.endTime}:00`);
    return end > start;
}, {
    message: "End time must be after start time.",
    path: ["endTime"],
});
export function SdcWorkItemsManager({ entry, isOpen, onOpenChange }: SdcWorkItemsManagerProps) {
  const { currentUser } = useAuthStore();
  const [items, setItems] = useState<SdcWorkPerformedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const canModify = currentUser?.role === 'Level 2' || currentUser?.role === 'Level 3' || currentUser?.id === entry.createdBy;
  const form = useForm<z.infer<typeof workItemSchema>>({
    resolver: zodResolver(workItemSchema),
    defaultValues: { name: '', startTime: '09:00', endTime: '10:00', notes: '' },
  });
  const fetchItems = useCallback(async () => {
    if (!entry.id) return;
    setLoading(true);
    try {
      const fetchedItems = await api<SdcWorkPerformedItem[]>(`/api/sdc-tracking/${entry.id}/work-items`);
      setItems(fetchedItems);
    } catch (error) {
      toast.error('Failed to fetch work items.');
    } finally {
      setLoading(false);
    }
  }, [entry.id]);
  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen, fetchItems]);
  const handleAddItem = async (values: z.infer<typeof workItemSchema>) => {
    try {
      await api(`/api/sdc-tracking/${entry.id}/work-items`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      toast.success('Work item added.');
      form.reset();
      fetchItems();
    } catch (error) {
      toast.error('Failed to add work item.');
    }
  };
  const handleDeleteItem = async (itemId: string) => {
    try {
      await api(`/api/sdc-tracking/${entry.id}/work-items/${itemId}`, { method: 'DELETE' });
      toast.success('Work item removed.');
      fetchItems();
    } catch (error) {
      toast.error('Failed to remove work item.');
    }
  };
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return 'Invalid';
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Work Items</DialogTitle>
          <DialogDescription>
            For SDC Entry by {entry.sdcPersonnelFirstName} {entry.sdcPersonnelLastName} on {entry.date}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {canModify && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddItem)} className="flex items-start gap-2 p-4 border rounded-lg bg-muted/50">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Task Name</FormLabel><FormControl><Input placeholder="Task name..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="startTime" render={({ field }) => (
                  <FormItem className="w-28"><FormLabel>Start</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="endTime" render={({ field }) => (
                  <FormItem className="w-28"><FormLabel>End</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Notes</FormLabel><FormControl><Input placeholder="Optional notes..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="pt-8">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Add</span>
                  </Button>
                </div>
              </form>
            </Form>
          )}
          <div className="border rounded-lg max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Item</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                  {canModify && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : items.length > 0 ? (
                  items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.startTime}</TableCell>
                      <TableCell>{item.endTime}</TableCell>
                      <TableCell>{calculateDuration(item.startTime, item.endTime)}</TableCell>
                      <TableCell>{item.notes}</TableCell>
                      {canModify && (
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <XCircle className="h-8 w-8 text-muted-foreground" />
                        <p>No work items have been added yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}