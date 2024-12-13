import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CircularProgressProps {
  value: number;
  className?: string;
  renderValue?: (value: number) => ReactNode;
}

const defaultRenderValue = (value: number) => `${value}%`;

const CircularProgress = ({
  value,
  className,
  renderValue = defaultRenderValue,
}: CircularProgressProps) => {
  return (
    <div className={cn('relative size-40', className)}>
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200 dark:text-neutral-700"
          stroke-width="2"
        ></circle>

        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-blue-600 dark:text-blue-500"
          stroke-width="2"
          stroke-dasharray="100"
          stroke-dashoffset={100 - value}
          stroke-linecap="round"
        ></circle>
      </svg>
    </div>
  );
};

export default CircularProgress;
