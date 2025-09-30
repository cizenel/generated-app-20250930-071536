import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, Loader2 } from 'lucide-react';
import { useDataExport } from '@/hooks/use-data-export';
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumnId: string;
  filterPlaceholder: string;
  actionButton?: React.ReactNode;
  exportFileName: string;
}
export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterPlaceholder,
  actionButton,
  exportFileName,
}: DataTableToolbarProps<TData>) {
  const { isExporting, exportToExcel, exportToPdf, exportToDocx } = useDataExport(
    table.getCoreRowModel().rows.map(row => row.original),
    exportFileName
  );
  return (
    <div className="flex items-center justify-between py-4 gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export As</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportToExcel}>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPdf}>PDF (.pdf)</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToDocx}>Word (.doc)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {actionButton}
      </div>
    </div>
  );
}