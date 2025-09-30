import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { SdcTrackingEntry, Sponsor, Center, Researcher, ProjectCode } from '@shared/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
const formSchema = z.object({
  sdcPersonnelFirstName: z.string().min(2, "First name is required"),
  sdcPersonnelLastName: z.string().min(2, "Last name is required"),
  patientCode: z.string().min(2, "Patient code is required"),
  date: z.string().min(1, "Date is required"),
  sponsorId: z.string().min(1, "Sponsor is required"),
  centerId: z.string().min(1, "Center is required"),
  researcherId: z.string().min(1, "Researcher is required"),
  projectCodeId: z.string().min(1, "Project code is required"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
}).refine(data => {
    const start = new Date(`1970-01-01T${data.startTime}:00`);
    const end = new Date(`1970-01-01T${data.endTime}:00`);
    return end > start;
}, {
    message: "End time must be after start time",
    path: ["endTime"],
});
interface RelatedData {
  sponsors: Sponsor[];
  centers: Center[];
  researchers: Researcher[];
  projectCodes: ProjectCode[];
}
interface SdcTrackingFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  defaultValues?: Partial<SdcTrackingEntry>;
  isSubmitting: boolean;
  relatedData: RelatedData;
}
export function SdcTrackingForm({ isOpen, onOpenChange, onSubmit, defaultValues, isSubmitting, relatedData }: SdcTrackingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sdcPersonnelFirstName: '',
      sdcPersonnelLastName: '',
      patientCode: '',
      date: new Date().toISOString().split('T')[0], // Today's date
      sponsorId: '',
      centerId: '',
      researcherId: '',
      projectCodeId: '',
      startTime: '09:00',
      endTime: '17:00',
      ...defaultValues,
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        sdcPersonnelFirstName: '',
        sdcPersonnelLastName: '',
        patientCode: '',
        date: new Date().toISOString().split('T')[0],
        sponsorId: '',
        centerId: '',
        researcherId: '',
        projectCodeId: '',
        startTime: '09:00',
        endTime: '17:00',
        ...defaultValues,
      });
    }
  }, [isOpen, defaultValues, form]);
  const isEditMode = !!defaultValues?.id;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[525px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit SDC Entry' : 'Add New SDC Entry'}</SheetTitle>
          <SheetDescription>
            Fill in the details for the Source Document Collection entry.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="sdcPersonnelFirstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sdcPersonnelLastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField control={form.control} name="patientCode" render={({ field }) => (
              <FormItem><FormLabel>Patient Code</FormLabel><FormControl><Input placeholder="P001" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="sponsorId" render={({ field }) => (
              <FormItem><FormLabel>Sponsor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a sponsor" /></SelectTrigger></FormControl><SelectContent>{relatedData.sponsors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="centerId" render={({ field }) => (
              <FormItem><FormLabel>Center</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a center" /></SelectTrigger></FormControl><SelectContent>{relatedData.centers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="researcherId" render={({ field }) => (
              <FormItem><FormLabel>Researcher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a researcher" /></SelectTrigger></FormControl><SelectContent>{relatedData.researchers.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="projectCodeId" render={({ field }) => (
              <FormItem><FormLabel>Project Code</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a project code" /></SelectTrigger></FormControl><SelectContent>{relatedData.projectCodes.map(p => <SelectItem key={p.id} value={p.id}>{p.code}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="endTime" render={({ field }) => (
                <FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create Entry'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}