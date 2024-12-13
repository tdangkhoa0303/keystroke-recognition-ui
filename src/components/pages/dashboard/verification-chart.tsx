import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

const chartData = [
  { date: '30-11', imposter: 186, legitimate: 80 },
  { date: '01-12', imposter: 305, legitimate: 200 },
  { date: '02-12', imposter: 237, legitimate: 120 },
  { date: '03-12', imposter: 73, legitimate: 190 },
  { date: '04-12', imposter: 209, legitimate: 130 },
  { date: '05-12', imposter: 120, legitimate: 100 },
  { date: '06-12', imposter: 111, legitimate: 342 },
  { date: '07-12', imposter: 123, legitimate: 111 },
  { date: '08-12', imposter: 246, legitimate: 234 },
  { date: '09-12', imposter: 214, legitimate: 190 },
  { date: '10-12', imposter: 150, legitimate: 210 },
  { date: '11-12', imposter: 195, legitimate: 125 },
  { date: '12-12', imposter: 180, legitimate: 175 },
  { date: '13-12', imposter: 140, legitimate: 200 },
];

const chartConfig = {
  imposter: {
    label: 'Imposter',
    color: 'hsl(var(--chart-1))',
  },
  legitimate: {
    label: 'Legitimate',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function VerificationChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
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
  );
}

export default VerificationChart;
