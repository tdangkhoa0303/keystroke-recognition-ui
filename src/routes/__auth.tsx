import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '@/auth';

export const Route = createFileRoute('/__auth')({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    throw redirect({ to: '/' });
  }

  return <Outlet />;
}
