import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { User } from '@shared/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
const formSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  password: z.string().optional(),
  role: z.enum(['Level 1', 'Level 2', 'Level 3']),
});
interface UserFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  defaultValues?: Partial<User>;
  isSubmitting: boolean;
}
export function UserForm({ isOpen, onOpenChange, onSubmit, defaultValues, isSubmitting }: UserFormProps) {
  const { currentUser } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'Level 1',
      ...defaultValues,
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        username: '',
        password: '',
        role: 'Level 1',
        ...defaultValues,
      });
    }
  }, [isOpen, defaultValues, form]);
  const isEditMode = !!defaultValues?.id;
  const isEditingSelf = isEditMode && currentUser?.id === defaultValues?.id;
  // Permission checks
  const canEditUsername = currentUser?.role === 'Level 2' || currentUser?.role === 'Level 3';
  const canEditRole = currentUser?.role === 'Level 3';
  const isLevel1EditingSelf = currentUser?.role === 'Level 1' && isEditingSelf;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit User' : 'Add New User'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Update the user's details." : 'Fill in the details to create a new user.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. john.doe"
                      {...field}
                      disabled={isSubmitting || (isEditMode && !canEditUsername) || isLevel1EditingSelf}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={isEditMode ? 'Leave blank to keep current password' : '••••••••'} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting || !canEditRole || isLevel1EditingSelf}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Level 1">Level 1 (Normal User)</SelectItem>
                      <SelectItem value="Level 2">Level 2 (Admin)</SelectItem>
                      <SelectItem value="Level 3">Level 3 (Super Admin)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create User'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}