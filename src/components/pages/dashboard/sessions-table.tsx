import DataTable from '@/components/ui/data-table';

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
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import { SessionData } from './types';
import Overlay from '@/components/ui/overlay';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

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
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<Sample & { id: string }>>('/api/samples', {
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

const SessionsTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    data: sessionsData,
    isFetched: isFetchedSessions,
    isPending,
  } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEY_PREFIX, SESSIONS_QUERY_KEY, pagination],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<SessionData>>('/api/sessions', {
          params: {
            page: pagination.pageIndex + 1,
            page_size: pagination.pageSize,
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
      sorting,
      expanded,
      pagination,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    rowCount: totalItems,
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
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
    <Card className="overflow-hidden">
      <Overlay loading={isPending}>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<SessionData>
            table={table}
            columns={columns}
            ExpandingRowComponent={ExpandingRow}
          />
        </CardContent>
      </Overlay>
    </Card>
  );
};

export default SessionsTable;
