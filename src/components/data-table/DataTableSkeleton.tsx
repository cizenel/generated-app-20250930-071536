import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
}: {
  columnCount: number;
  rowCount?: number;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Skeleton className="h-10 w-[250px] sm:w-[384px]" />
        <Skeleton className="h-10 w-[105px] ml-auto" />
        <Skeleton className="h-10 w-[110px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}