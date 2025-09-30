import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth-store';
import { SdcTrackingEntry, User } from '@shared/types';
import { toast } from 'sonner';
interface ActionMenuCellProps<TData> {
  row: Row<TData>;
  onEdit: (data: TData) => void;
  onDelete: (data: TData) => void;
  onManageWorkItems?: (data: TData) => void;
}
export function ActionMenuCell<TData extends { id: string }>({ row, onEdit, onDelete, onManageWorkItems }: ActionMenuCellProps<TData>) {
  const { currentUser } = useAuthStore.getState();
  const data = row.original;
  // Type guards
  const isUser = (d: any): d is User => 'username' in d;
  const isSdcTrackingEntry = (d: any): d is SdcTrackingEntry => 'sdcPersonnelFirstName' in d;
  const canModify = currentUser?.role === 'Level 2' || currentUser?.role === 'Level 3';
  let canEdit = canModify;
  let canDelete = canModify;
  if (isUser(data)) {
    const isSelf = currentUser?.id === data.id;
    const isSuperAdmin = data.id === 'user-001';
    canEdit = canModify || isSelf;
    canDelete = canModify && !isSuperAdmin;
  }
  if (isSdcTrackingEntry(data)) {
    const isCreator = currentUser?.id === data.createdBy;
    canEdit = canModify || isCreator;
    canDelete = canModify || isCreator;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => toast.info(`ID Copied: ${data.id}`)}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {onManageWorkItems && (
          <DropdownMenuItem onClick={() => onManageWorkItems(data)}>
            Manage Work Items
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(data)} disabled={!canEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(data)}
          disabled={!canDelete}
          className="text-red-500 focus:bg-red-100 focus:text-red-700"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}