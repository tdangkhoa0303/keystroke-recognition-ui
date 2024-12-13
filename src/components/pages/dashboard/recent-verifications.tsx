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
import Overlay from '@/components/ui/overlay';
import {
  DASHBOARD_QUERY_KEY_PREFIX,
  SAMPLES_QUERY_KEY,
} from '@/constants/query-keys';
import { SECURITY_LEVEL_TEXTS } from '@/constants/texts';
import apiClient from '@/lib/api-client';
import { Sample } from '@/models/sample';
import { SecurityLevel } from '@/models/user';
import { PaginatedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
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

export const columns = [
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
            <AvatarFallback>{userName}</AvatarFallback>
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
      <DataTable.Header column={column} title="Verified At" />
    ),
    cell: ({ getValue }) => {
      return <span>{format(getValue(), 'dd MMM yyyy HH:mm:ss')}</span>;
    },
    enableSorting: false,
    enableHiding: false,
  }),
];

const RecentVerifications = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: samplesData, isPending: isFetchingSamples } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEY_PREFIX, SAMPLES_QUERY_KEY, pagination],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<SampleData>>('/api/samples', {
          params: {
            page: pagination.pageIndex + 1,
            page_size: pagination.pageSize,
          },
        })
        .then((res) => res.data),
  });

  const { items: samples = [], total_items: totalItems = 0 } =
    samplesData ?? {};

  const table = useReactTable({
    data: samples,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      columnFilters,
    },
    rowCount: totalItems,
    manualPagination: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <Card className="w-full h-full overflow-hidden">
      <Overlay loading={isFetchingSamples}>
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
          />
        </CardContent>
      </Overlay>
    </Card>
  );
};

export default RecentVerifications;
