import {
  ColumnDef,
  Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';
import { ComponentType, Fragment } from 'react';

interface DataTableProps<TData> {
  columns: {
    [K in keyof TData]: ColumnDef<TData, TData[K]>;
  }[keyof TData][];
  table: TanstackTable<TData>;
  pageSizeOptions?: number[];
  ExpandingRowComponent?: ComponentType<{ data: TData }>;
}

const DataTable = <TData,>({
  table,
  columns,
  pageSizeOptions,
  ExpandingRowComponent,
}: DataTableProps<TData>) => {
  return (
    <>
      <div className="mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isExpanded = row.getIsExpanded();

                return (
                  <Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isExpanded && ExpandingRowComponent && (
                      <ExpandingRowComponent data={row.original} />
                    )}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </>
  );
};

DataTable.Header = DataTableColumnHeader;
DataTable.ViewOptions = DataTableViewOptions;
DataTable.FacetedFilter = DataTableFacetedFilter;
DataTable.Pagination = DataTablePagination;

export default DataTable;
