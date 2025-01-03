import { Skeleton } from '@/components/ui/skeleton';

const StatisticSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-3 w-[200px]" />
    <Skeleton className="h-3 w-[150px]" />
  </div>
);

export default StatisticSkeleton;
