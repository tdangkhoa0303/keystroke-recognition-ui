import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import ModeToggle from '@/components/mode-toggle';

export const Route = createFileRoute('/__auth')({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
