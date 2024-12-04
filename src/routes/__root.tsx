import { Toaster } from '@/components/ui/toaster';
import {
  createRootRoute,
  createRootRouteWithContext,
  Link,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import type { AuthContext } from '../auth';

interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <Outlet />
      <Toaster />
      <ScrollRestoration />
      <TanStackRouterDevtools />
    </>
  );
}
