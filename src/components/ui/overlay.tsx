import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { HashLoader } from 'react-spinners';

export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  loading: boolean;
}

const Overlay = ({ loading, children, className, ...props }: OverlayProps) => {
  return (
    <div
      className={cn('relative w-full h-full rounded-md min-h-10', className)}
      {...props}
    >
      {loading && (
        <>
          <HashLoader
            size={40}
            color="#00AB55"
            className="!absolute top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2"
          />
          <div className="w-full h-full absolute bg-slate-200 bg-opacity-5" />
        </>
      )}

      {children}
    </div>
  );
};

export default Overlay;
