import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DASHBOARD_QUERY_KEY_PREFIX,
  SAMPLE_STATISTICS_QUERY_KEY,
} from '@/constants/query-keys';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { LineChartIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import StatisticSkeleton from './statistic-skeleton';
import { DEFAULT_REFETCH_INTERVAL } from './constants';

const SampleStatistics = ({ dateRange }: { dateRange: DateRange }) => {
  const { data: statisticsData, isFetched } = useQuery({
    queryKey: [
      DASHBOARD_QUERY_KEY_PREFIX,
      SAMPLE_STATISTICS_QUERY_KEY,
      dateRange,
    ],
    refetchOnMount: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    queryFn: () =>
      apiClient
        .get<{ totalSamples: number; totalSuccess: number }>(
          '/api/statistics/samples',
          {
            params: {
              start_date: dateRange.from,
              end_date: dateRange.to,
            },
          }
        )
        .then((res) => res.data),
  });

  const { totalSamples = 0, totalSuccess = 0 } = statisticsData ?? {};

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Failed Verification Rate
        </CardTitle>
        <LineChartIcon className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {!isFetched ? (
            <StatisticSkeleton />
          ) : (
            `${(((totalSamples - totalSuccess) / totalSamples) * 100).toFixed(
              2
            )}% (${totalSamples - totalSuccess}/${totalSamples})`
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleStatistics;
