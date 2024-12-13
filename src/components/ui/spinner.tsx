import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SpinnerProps {
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

const Spinner = ({ loading, children, className }: SpinnerProps) => (
  <div className="relative w-full">
    <div className="absolute top-[50%] left-[50%] bg-white w-10 h-10 translate-x-[50%] translate-y-[-50%]" />
    {loading !== false && (
      <div className="flex absolute top-[50%] left-[50%]">
        <span
          className={cn('relative w-[120px] h-[90px] my-0 mx-auto', className)}
        >
          <span className="absolute h-1 w-8 rounded-sm shadow-sm animate-loading-step top-0 right-0" />
          <span className="absolute bottom-[50%] left-[50%] translate-x-[50%] translate-y-[-50%] h-5 w-5 rounded-full animate-loading-bounce bg-orange-600" />
        </span>
      </div>
    )}
    {children}
  </div>
);

export default Spinner;
