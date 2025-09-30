import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User, Sponsor, Center, Researcher, ProjectCode, WorkPerformed, SdcTrackingEntry } from '@shared/types';
import { ActionMenuCell } from './ActionMenuCell';
const createSortableHeader = <TData,>(title: string) => {
  return ({ column }: { column: Column<TData, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};
type ColumnFactory<TData> = (
  onEdit: (data: TData) => void,
  onDelete: (data: TData) => void,
  onManageWorkItems?: (data: TData) => void
) => ColumnDef<TData>[];
export const createUserColumns: ColumnFactory<User> = (onEdit, onDelete) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: createSortableHeader('Username'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const variant = role === 'Level 3' ? 'destructive' : role === 'Level 2' ? 'default' : 'secondary';
      return <Badge variant={variant}>{role}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: createSortableHeader('Created At'),
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />,
  },
];
export const createSponsorColumns: ColumnFactory<Sponsor> = (onEdit, onDelete) => [
  { accessorKey: 'name', header: createSortableHeader('Name') },
  { accessorKey: 'contactPerson', header: 'Contact Person' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={status === 'Active' ? 'default' : 'outline'}>{status}</Badge>
    }
  },
  { id: 'actions', cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} /> },
];
export const createCenterColumns: ColumnFactory<Center> = (onEdit, onDelete) => [
    { accessorKey: 'name', header: createSortableHeader('Name') },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'primaryContact', header: 'Primary Contact' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={status === 'Active' ? 'default' : 'outline'}>{status}</Badge>
        }
    },
    { id: 'actions', cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} /> },
];
export const createResearcherColumns: ColumnFactory<Researcher> = (onEdit, onDelete) => [
    { accessorKey: 'name', header: createSortableHeader('Name') },
    { accessorKey: 'specialty', header: 'Specialty' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'centerId', header: 'Center ID' },
    { id: 'actions', cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} /> },
];
export const createProjectCodeColumns: ColumnFactory<ProjectCode> = (onEdit, onDelete) => [
    { accessorKey: 'code', header: createSortableHeader('Code') },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'sponsorId', header: 'Sponsor ID' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant = status === 'Ongoing' ? 'default' : status === 'Completed' ? 'secondary' : 'destructive';
            return <Badge variant={variant as any}>{status}</Badge>
        }
    },
    { id: 'actions', cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} /> },
];
export const createWorkPerformedColumns: ColumnFactory<WorkPerformed> = (onEdit, onDelete) => [
    { accessorKey: 'name', header: createSortableHeader('Name') },
    { accessorKey: 'description', header: 'Description' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant = status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline';
            return <Badge variant={variant as any}>{status}</Badge>
        }
    },
    { id: 'actions', cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} /> },
];
interface RelatedData {
  sponsors: Sponsor[];
  centers: Center[];
  researchers: Researcher[];
  projectCodes: ProjectCode[];
}
export const createSdcTrackingColumns = (
  onEdit: (data: SdcTrackingEntry) => void,
  onDelete: (data: SdcTrackingEntry) => void,
  onManageWorkItems: (data: SdcTrackingEntry) => void,
  relatedData: RelatedData
): ColumnDef<SdcTrackingEntry>[] => {
  const sponsorsMap = new Map(relatedData.sponsors.map(s => [s.id, s.name]));
  const centersMap = new Map(relatedData.centers.map(c => [c.id, c.name]));
  return [
    {
      id: 'personnel',
      header: createSortableHeader('Personnel'),
      cell: ({ row }) => `${row.original.sdcPersonnelFirstName} ${row.original.sdcPersonnelLastName}`,
    },
    { accessorKey: 'patientCode', header: createSortableHeader('Patient Code') },
    { accessorKey: 'date', header: createSortableHeader('Date') },
    {
      accessorKey: 'sponsorId',
      header: 'Sponsor',
      cell: ({ row }) => sponsorsMap.get(row.getValue('sponsorId')) || row.getValue('sponsorId'),
    },
    {
      accessorKey: 'centerId',
      header: 'Center',
      cell: ({ row }) => centersMap.get(row.getValue('centerId')) || row.getValue('centerId'),
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: ({ row }) => {
        const startTime = row.original.startTime;
        const endTime = row.original.endTime;
        if (!startTime || !endTime) return 'N/A';
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMs = end.getTime() - start.getTime();
        if (diffMs < 0) return 'Invalid';
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
      },
    },
    { id: 'actions', cell: ({ row }) => <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} onManageWorkItems={onManageWorkItems} /> },
  ];
};