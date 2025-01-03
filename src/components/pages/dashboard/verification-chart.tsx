import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import Spinner from '@/components/ui/spinner';
import {
  DASHBOARD_QUERY_KEY_PREFIX,
  VERIFICATION_STATISTICS_QUERY_KEY,
} from '@/constants/query-keys';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

const chartConfig = {
  imposter: {
    label: 'Imposter',
    color: 'hsl(var(--chart-3))',
  },
  legitimate: {
    label: 'Legitimate',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function VerificationChart({ dateRange }: { dateRange: DateRange }) {
  const { data: statisticsData = [], isFetching: isFetchingSampleStatistics } =
    useQuery({
      queryKey: [
        DASHBOARD_QUERY_KEY_PREFIX,
        VERIFICATION_STATISTICS_QUERY_KEY,
        dateRange,
      ],

      refetchOnMount: true,
      queryFn: () =>
        apiClient
          .get<Array<{ date: string; imposter: number; legitimate: number }>>(
            '/api/statistics/verifications',
            {
              params: {
                start_date: dateRange.from,
                end_date: dateRange.to,
              },
            }
          )
          .then((res) => res.data),
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Rate</CardTitle>
        <CardDescription>
          Observe the current verification results
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Spinner loading={isFetchingSampleStatistics}>
          <ResponsiveContainer width="100%" height={350}>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={statisticsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="imposter"
                  stackId="a"
                  fill="var(--color-imposter)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="legitimate"
                  stackId="a"
                  fill="var(--color-legitimate)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </Spinner>
      </CardContent>
    </Card>
  );
}

export default VerificationChart;
