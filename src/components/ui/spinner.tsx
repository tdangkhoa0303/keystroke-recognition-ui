import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { HashLoader } from 'react-spinners';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  loading: boolean;
  withBackground?: boolean;
}

const SPINNER_COLOR = '#00AB55';

const Spinner = ({
  loading,
  children,
  className,
  size = 40,
  ...props
}: SpinnerProps) => {
  if (!children)
    return loading ? <HashLoader size={size} color={SPINNER_COLOR} /> : null;

  return (
    <div
      className={cn('relative w-full h-full rounded-md min-h-10', className)}
      {...props}
    >
      {loading && (
        <>
          <div className="!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <HashLoader size={size} color={SPINNER_COLOR} />
          </div>
          <div className="w-full h-full absolute bg-slate-200 bg-opacity-10" />
        </>
      )}

      {children}
    </div>
  );
};

export default Spinner;
