import { createFileRoute } from '@tanstack/react-router';

import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import RecentVerifications from '@/components/pages/dashboard/recent-verifications';
import SessionsTable from '@/components/pages/dashboard/sessions-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LineChartIcon, User2 } from 'lucide-react';
import VerificationChart from '@/components/pages/dashboard/verification-chart';

export const Route = createFileRoute('/__auth/dashboard')({
  component: () => <Dashboard />,
});

function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Keystroke Enabled Users
            </CardTitle>
            <User2 className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Verification Rate
            </CardTitle>
            <LineChartIcon className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10%</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verification Rate</CardTitle>
            <CardDescription>
              Observe the current verification results
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <VerificationChart />
          </CardContent>
        </Card>
        <RecentVerifications />
      </div>
      <SessionsTable />
    </>
  );
}
