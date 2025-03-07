import { createFileRoute } from '@tanstack/react-router';

import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import RecentVerifications from '@/components/pages/monitor/recent-verifications';
import SampleStatistics from '@/components/pages/monitor/sample-statistics';
import SessionsTable from '@/components/pages/monitor/sessions-table';
import UserStatistics from '@/components/pages/monitor/user-statistics';
import VerificationChart from '@/components/pages/monitor/verification-chart';
import { Button } from '@/components/ui/button';
import { DASHBOARD_QUERY_KEY_PREFIX } from '@/constants/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { subMonths } from 'date-fns';
import { RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const Route = createFileRoute('/__protected/monitor')({
  component: () => <Dashboard />,
});

const TODAY = new Date();

function Dashboard() {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(TODAY, 4),
    to: TODAY,
  });

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Monitor</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker
            value={dateRange}
            onChange={(value) => {
              if (value) {
                setDateRange(value);
              }
            }}
          />
          <Button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: [DASHBOARD_QUERY_KEY_PREFIX],
              })
            }
          >
            <RefreshCwIcon />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <UserStatistics dateRange={dateRange} />
        <SampleStatistics dateRange={dateRange} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <VerificationChart dateRange={dateRange} />
        <RecentVerifications dateRange={dateRange} />
      </div>
      <SessionsTable dateRange={dateRange} />
    </>
  );
}
