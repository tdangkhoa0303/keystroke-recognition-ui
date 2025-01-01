import DataTable from '@/components/ui/data-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Overlay from '@/components/ui/spinner';
import {
  DASHBOARD_QUERY_KEY_PREFIX,
  SAMPLES_QUERY_KEY,
} from '@/constants/query-keys';
import { SECURITY_LEVEL_TEXTS } from '@/constants/texts';
import apiClient from '@/lib/api-client';
import { Sample } from '@/models/sample';
import { SecurityLevel } from '@/models/user';
import { PaginatedResponse } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  BanIcon,
  CheckCircle,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import Spinner from '@/components/ui/spinner';
import { getNameAvatar } from '@/lib/utils';

const SECURITY_LEVEL_ICONS = {
  [SecurityLevel.LOW]: ChevronDown,
  [SecurityLevel.MEDIUM]: ChevronsUpDown,
  [SecurityLevel.HIGH]: ChevronUp,
};

type SampleData = {
  user: {
    first_name: string;
    last_name: string;
  };
  id: string;
} & Sample;

const columnHelper = createColumnHelper<SampleData>();

const columns = [
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
  columnHelper.accessor('events', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Sample Size" />
    ),
    cell: ({ getValue, row }) => <span>{getValue().length}</span>,
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('predicted_score', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Predicted Score" />
    ),
    cell: ({ getValue }) => <span>{getValue().toPrecision(8)}</span>,
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('security_level', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Security Level" />
    ),
    cell: ({ getValue }) => {
      const securityLevel = getValue();
      const Icon = SECURITY_LEVEL_ICONS[securityLevel];
      return (
        <span className="flex items-center">
          <Badge variant="default" className="w-[96px]">
            <Icon className="mr-2 w-4 h-4" />
            {SECURITY_LEVEL_TEXTS[securityLevel]}
          </Badge>
        </span>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('is_legitimate', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Validity" className="min-w-20" />
    ),
    cell: ({ getValue }) => {
      return getValue() ? (
        <CheckCircle className="text-green-500" />
      ) : (
        <BanIcon className="text-red-500" />
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => (
      <DataTable.Header column={column} title="Verified At" />
    ),
    cell: ({ getValue }) => {
      return <span>{format(getValue(), 'dd MMM yyyy HH:mm:ss')}</span>;
    },
    enableSorting: false,
    enableHiding: false,
  }),
];

const RecentVerifications = ({ dateRange }: { dateRange: DateRange }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: samplesData, isFetching: isFetchingSamples } = useQuery({
    queryKey: [
      DASHBOARD_QUERY_KEY_PREFIX,
      SAMPLES_QUERY_KEY,
      pagination,
      dateRange,
    ],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<SampleData>>('/api/samples/', {
          params: {
            page: pagination.pageIndex + 1,
            page_size: pagination.pageSize,
            start_date: dateRange.from,
            end_date: dateRange.to,
          },
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const { items: samples = [], total_items: totalItems = 0 } =
    samplesData ?? {};

  const table = useReactTable({
    data: samples,
    columns,
    state: {
      pagination,
      columnVisibility,
      columnFilters,
    },
    rowCount: totalItems,
    manualPagination: true,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Verifications</CardTitle>
        <CardDescription>
          Observe the current verification results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable<SampleData>
          table={table}
          columns={columns}
          pageSizeOptions={[6, 12, 24]}
          loading={isFetchingSamples}
        />
      </CardContent>
    </Card>
  );
};

export default RecentVerifications;
