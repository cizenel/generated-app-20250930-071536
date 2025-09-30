import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { DefinitionEntity } from '@shared/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
type EntityType = 'sponsors' | 'centers' | 'researchers' | 'project-codes' | 'work-performed';
const sponsorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email(),
  status: z.enum(['Active', 'Inactive']),
});
const centerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  primaryContact: z.string().min(2, "Primary contact is required"),
  status: z.enum(['Active', 'Inactive']),
});
const researcherSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialty: z.string().min(2, "Specialty is required"),
  centerId: z.string().min(1, "Center ID is required"),
  email: z.string().email(),
});
const projectCodeSchema = z.object({
  code: z.string().min(2, "Code is required"),
  description: z.string().min(5, "Description is required"),
  sponsorId: z.string().min(1, "Sponsor ID is required"),
  status: z.enum(['Ongoing', 'Completed', 'On Hold']),
});
const workPerformedSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
});
const schemas = {
  sponsors: sponsorSchema,
  centers: centerSchema,
  researchers: researcherSchema,
  'project-codes': projectCodeSchema,
  'work-performed': workPerformedSchema,
};
type FormFieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select';
  placeholder?: string;
  options?: string[];
};
const formFieldsConfig: Record<EntityType, FormFieldConfig[]> = {
  sponsors: [
    { name: 'name', label: 'Sponsor Name', type: 'text', placeholder: 'Global Health Inc.' },
    { name: 'contactPerson', label: 'Contact Person', type: 'text', placeholder: 'Dr. Emily Carter' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'ecarter@gh.com' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ],
  centers: [
    { name: 'name', label: 'Center Name', type: 'text', placeholder: 'Downtown Research Center' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY' },
    { name: 'primaryContact', label: 'Primary Contact', type: 'text', placeholder: 'Dr. Michael Lee' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ],
  researchers: [
    { name: 'name', label: 'Researcher Name', type: 'text', placeholder: 'Dr. Olivia Chen' },
    { name: 'specialty', label: 'Specialty', type: 'text', placeholder: 'Oncology' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'olivia.chen@drc.org' },
    { name: 'centerId', label: 'Center ID', type: 'text', placeholder: 'ctr-001' },
  ],
  'project-codes': [
    { name: 'code', label: 'Project Code', type: 'text', placeholder: 'ONC-2024-01' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Phase III Oncology Trial' },
    { name: 'sponsorId', label: 'Sponsor ID', type: 'text', placeholder: 'sp-001' },
    { name: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed', 'On Hold'] },
  ],
  'work-performed': [
    { name: 'name', label: 'Work Name', type: 'text', placeholder: 'Initial Patient Screening' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Screening of first 50 patients' },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed'] },
  ],
};
interface DefinitionFormProps {
  entityType: EntityType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  defaultValues?: Partial<DefinitionEntity>;
  isSubmitting: boolean;
}
export function DefinitionForm(props: DefinitionFormProps) {
  const schema = schemas[props.entityType];
  return <TypedDefinitionForm {...props} schema={schema} />;
}
interface TypedDefinitionFormProps<T extends z.ZodType<any, any>> extends DefinitionFormProps {
  schema: T;
}
function TypedDefinitionForm<T extends z.ZodType<any, any>>({
  entityType,
  isOpen,
  onOpenChange,
  onSubmit,
  defaultValues,
  isSubmitting,
  schema,
}: TypedDefinitionFormProps<T>) {
  type FormValues = z.infer<T>;
  const formFields = formFieldsConfig[entityType];
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues | undefined,
  });
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues as FormValues | undefined ?? {} as FormValues);
    }
  }, [isOpen, defaultValues, form]);
  const handleFormSubmit = (values: FormValues) => {
    return onSubmit(values);
  };
  const isEditMode = !!defaultValues?.id;
  const title = entityType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const singularTitle = title.endsWith('s') ? title.slice(0, -1) : title;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[525px]">
        <SheetHeader>
          <SheetTitle>{isEditMode ? `Edit ${singularTitle}` : `Add New ${singularTitle}`}</SheetTitle>
          <SheetDescription>
            {isEditMode ? `Update the ${singularTitle.toLowerCase()} details.` : `Fill in the details to create a new ${singularTitle.toLowerCase()}.`}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            {formFields.map((fieldConfig) => (
              <FormField
                key={fieldConfig.name}
                control={form.control}
                name={fieldConfig.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      {fieldConfig.type === 'select' ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select a ${fieldConfig.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldConfig.options?.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}