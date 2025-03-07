import {
  Navigate,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';

import { MainNav } from '@/components/dashboard/main-nav';
import { Search } from '@/components/dashboard/search';
import Logo from '@/components/logo';
import ModeToggle from '@/components/mode-toggle';
import { UserNav } from '@/components/user-nav';
import { useAuth } from '../auth';

export const Route = createFileRoute('/__protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <img
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 max-w-screen-2xl m-auto">
            <Logo className="w-9 h-9" />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4 pt-6 max-w-screen-2xl m-auto w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
