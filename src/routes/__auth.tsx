import * as React from 'react';
import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router';

import { useAuth } from '../auth';
import { UserNav } from '@/components/user-nav';
import TeamSwitcher from '@/components/dashboard/team-switcher';
import { Search } from '@/components/dashboard/search';
import { MainNav } from '@/components/dashboard/main-nav';

export const Route = createFileRoute('/__auth')({
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
  component: AuthLayout,
});

function AuthLayout() {
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
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}
