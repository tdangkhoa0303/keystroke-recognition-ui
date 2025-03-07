import { useAuth } from '@/auth';
import { cn } from '@/lib/utils';
import { UserRole } from '@/models/user';
import { Link } from '@tanstack/react-router';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { user } = useAuth();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      {user?.role === UserRole.ADMIN && (
        <Link
          href="/monitor"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Monitor
        </Link>
      )}
    </nav>
  );
}
