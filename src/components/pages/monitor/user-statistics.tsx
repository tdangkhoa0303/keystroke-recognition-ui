import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DASHBOARD_QUERY_KEY_PREFIX,
  USER_STATISTICS_QUERY_KEY,
} from '@/constants/query-keys';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { User2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import StatisticSkeleton from './statistic-skeleton';
import { DEFAULT_REFETCH_INTERVAL } from './constants';

const UserStatistics = ({ dateRange }: { dateRange: DateRange }) => {
  const { data: statisticsData, isFetched } = useQuery({
    queryKey: [
      DASHBOARD_QUERY_KEY_PREFIX,
      USER_STATISTICS_QUERY_KEY,
      dateRange,
    ],
    refetchOnMount: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    queryFn: () =>
      apiClient
        .get<{ enabledUsers: number; totalUsers: number }>(
          '/api/statistics/users',
          {
            params: {
              start_date: dateRange.from,
              end_date: dateRange.to,
            },
          }
        )
        .then((res) => res.data),
  });

  const { enabledUsers, totalUsers } = statisticsData ?? {};

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Keystroke Enabled Users
        </CardTitle>
        <User2 className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold h-8 flex items-center">
          {!isFetched ? <StatisticSkeleton /> : `${enabledUsers}/${totalUsers}`}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatistics;
