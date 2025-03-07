import DataTable from '@/components/ui/data-table';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import {
  DASHBOARD_QUERY_KEY_PREFIX,
  SESSIONS_QUERY_KEY,
} from '@/constants/query-keys';
import { SECURITY_LEVEL_TEXTS } from '@/constants/texts';
import apiClient from '@/lib/api-client';
import { Sample } from '@/models/sample';
import { SecurityLevel } from '@/models/user';
import { PaginatedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  RefreshCwIcon,
} from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { columns } from './columns';
import { SessionData } from './types';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { DEFAULT_REFETCH_INTERVAL } from './constants';

const DEFAULT_DATA: SessionData[] = [];

const SECURITY_LEVEL_ICONS = {
  [SecurityLevel.LOW]: ChevronDown,
  [SecurityLevel.MEDIUM]: ChevronsUpDown,
  [SecurityLevel.HIGH]: ChevronUp,
};

const SAMPLE_COLUMNS = [
  {
    header: 'Created At',
    colSpan: 3,
    dataExtractor: (sample: Sample) =>
      format(sample.created_at, 'dd MMM yyyy HH:mm:ss'),
  },
  {
    header: 'Sample Size',
    dataExtractor: (sample: Sample) => sample.events.length,
  },
  {
    colSpan: 2,
    header: 'Score',
    dataExtractor: (sample: Sample) => sample.predicted_score.toPrecision(8),
  },
  {
    colSpan: 2,
    header: 'Security Level',
    dataExtractor: (sample: Sample) => {
      const Icon = SECURITY_LEVEL_ICONS[sample.security_level];
      return (
        <span className="flex items-center">
          <Icon className="mr-2 w-4 h-4" />
          {SECURITY_LEVEL_TEXTS[sample.security_level]}
        </span>
      );
    },
  },
];

const ExpandingRow = ({ data }: { data: SessionData }) => {
  const { data: samplesData, isFetched: isFetchedSamples } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEY_PREFIX, SESSIONS_QUERY_KEY, data.id],
    refetchOnMount: true,
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<Sample & { id: string }>>('/api/samples/', {
          params: {
            session_id: data.id,
          },
        })
        .then((res) => res.data),
  });

  if (!isFetchedSamples) {
    return (
      <TableRow>
        <td />
        <TableCell className="h-8">
          <Icons.spinner className="animate-spin h-4 w-4" />
        </TableCell>
      </TableRow>
    );
  }

  const samples = samplesData?.items ?? [];

  return (
    <>
      <TableRow>
        <th />
        {SAMPLE_COLUMNS.map(({ header, colSpan }) => (
          <TableHead key={header} colSpan={colSpan}>
            {header}
          </TableHead>
        ))}
      </TableRow>
      {samples.map((sample) => (
        <TableRow key={sample.id}>
          <td />
          {SAMPLE_COLUMNS.map(({ header, dataExtractor, colSpan }) => (
            <TableCell
              key={`${sample.id}_${header}`}
              className="py-2"
              colSpan={colSpan}
            >
              {dataExtractor(sample)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

const SessionsTable = ({ dateRange }: { dateRange: DateRange }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const {
    data: sessionsData,
    isFetched,
    isFetching,
    refetch,
  } = useQuery({
    refetchOnMount: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    queryKey: [
      DASHBOARD_QUERY_KEY_PREFIX,
      SESSIONS_QUERY_KEY,
      pagination,
      dateRange,
    ],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<SessionData>>('/api/sessions/', {
          params: {
            page: pagination.pageIndex + 1,
            page_size: pagination.pageSize,
            start_date: dateRange.from,
            end_date: dateRange.to,
          },
        })
        .then((res) => res.data),
  });

  const { items: sessions = DEFAULT_DATA, total_items: totalItems = 0 } =
    sessionsData ?? {};

  const table = useReactTable({
    data: sessions,
    columns,
    state: {
      expanded,
      pagination,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    rowCount: totalItems,
    manualPagination: true,
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => row.original.samples[0].total_samples > 0,
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Sessions</span>
          <Button onClick={() => refetch()} disabled={isFetching}>
            <RefreshCwIcon
              className={clsx({
                'animate-spin': isFetching,
              })}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable<SessionData>
          table={table}
          columns={columns}
          loading={!isFetched}
          ExpandingRowComponent={ExpandingRow}
        />
      </CardContent>
    </Card>
  );
};

export default SessionsTable;
