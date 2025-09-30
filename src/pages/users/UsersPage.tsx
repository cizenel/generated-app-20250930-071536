import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { createUserColumns } from '@/components/data-table/DataTableColumns';
import { useAuthStore } from '@/stores/auth-store';
import { PlusCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
import { DataTableSkeleton } from '@/components/data-table/DataTableSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserForm } from '@/components/UserForm';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
export function UsersPage() {
  const { currentUser } = useAuthStore();
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api<{ items: Omit<User, 'password'>[] }>('/api/users');
      setUsers(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users.');
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const visibleUsers = useMemo(() => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'Level 3': // Super Admin sees everyone
        return users;
      case 'Level 2': // Admin sees themselves and Level 1 users
        return users.filter(user => user.role === 'Level 1' || user.id === currentUser.id);
      case 'Level 1': // Normal User sees only themselves
        return users.filter(user => user.id === currentUser.id);
      default:
        return [];
    }
  }, [users, currentUser]);
  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Update user
        const payload = { ...values };
        if (!payload.password) {
          delete payload.password; // Don't send empty password
        }
        await api<User>(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('User updated successfully!');
      } else {
        // Create user
        await api<User>('/api/users', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        toast.success('User created successfully!');
      }
      setIsSheetOpen(false);
      setEditingUser(undefined);
      fetchUsers(); // Refetch users to see changes
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      toast.error(`Operation failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsSheetOpen(true);
  };
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await api(`/api/users/${userToDelete.id}`, { method: 'DELETE' });
      toast.success('User deleted successfully!');
      fetchUsers(); // Refetch users to see changes
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      toast.error(`Deletion failed: ${errorMessage}`);
    } finally {
      setUserToDelete(null);
      setIsDeleting(false);
    }
  };
  const canAddUsers = currentUser?.role === 'Level 2' || currentUser?.role === 'Level 3';
  const ActionButton = canAddUsers ? (
    <Button onClick={handleAddUser}>
      <PlusCircle className="mr-2 h-4 w-4" /> Add User
    </Button>
  ) : null;
  const userColumns = React.useMemo(() => createUserColumns(handleEditUser, handleDeleteUser), []);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display">User Management</h1>
        <p className="text-muted-foreground">
          View, add, and manage system users.
        </p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <DataTableSkeleton columnCount={5} rowCount={5} />
      ) : (
        <DataTable
          columns={userColumns}
          data={visibleUsers}
          filterColumnId="username"
          filterPlaceholder="Filter by username..."
          actionButton={ActionButton}
          exportFileName="mls_users"
        />
      )}
      <UserForm
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleFormSubmit}
        defaultValues={editingUser}
        isSubmitting={isSubmitting}
      />
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for "{userToDelete?.username}".
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