import { Checkbox } from '@/components/ui/checkbox';
import { createColumnHelper } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn, getNameAvatar } from '@/lib/utils';
import { format } from 'date-fns';
import { BanIcon, CheckCircle, ChevronDown } from 'lucide-react';
import { DataTableRowActions } from './data-table-row-actions';
import { SessionData } from './types';

const columnHelper = createColumnHelper<SessionData>();

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('user', {
    header: ({ column }) => <DataTable.Header column={column} title="User" />,
    cell: ({ getValue, row }) => {
      const user = getValue();
      const userName = `${user.first_name} ${user.last_name}`;

      return (
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={row.getToggleExpandedHandler()}
        >
          <div className="w-4 h-4">
            {row.getCanExpand() && (
              <ChevronDown
                className={cn(
                  'transition-all ease-in-out w-4 h-4',
                  row.getIsExpanded() ? 'rotate-0' : '-rotate-90'
                )}
              />
            )}
          </div>
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`https://avatar.iran.liara.run/public?username=${userName}`}
              alt={userName}
            />
            <AvatarFallback>{getNameAvatar(userName)}</AvatarFallback>
          </Avatar>
          <div className="font-medium whitespace-nowrap">{userName}</div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('user.email', {
    header: ({ column }) => <DataTable.Header column={column} title="Email" />,
    cell: ({ getValue, row }) => <span>{getValue()}</span>,
    enableSorting: false,
    enableHiding: false,
  }),

  columnHelper.accessor('ip', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="IP Address" />
    ),
    cell: ({ getValue }) => {
      return <Badge variant="outline">{getValue()}</Badge>;
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('ua', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="User Agent" />
    ),
    cell: ({ getValue }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block max-w-[320px] overflow-hidden text-ellipsis whitespace-nowrap">
                {getValue()}
              </span>
            </TooltipTrigger>
            <TooltipContent>{getValue()}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('samples', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Success Rate" />
    ),
    cell: ({ getValue, row }) => {
      const [{ total_legitimate, total_samples }] = getValue();

      return (
        <div className="flex items-center gap-2">
          {total_samples ? (
            <>
              <span>{total_legitimate}</span>/<span>{total_samples}</span>{' '}
            </>
          ) : (
            '-'
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('is_revoked', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Validity" className="min-w-20" />
    ),
    cell: ({ getValue }) => {
      return getValue() ? (
        <BanIcon className="text-red-500" />
      ) : (
        <CheckCircle className="text-green-500" />
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Start From" />
    ),
    cell: ({ getValue }) => {
      return <span>{format(getValue(), 'dd MMM yyyy HH:mm:ss')}</span>;
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }),
];
