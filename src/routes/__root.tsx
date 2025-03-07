import { Toaster } from '@/components/ui/toaster';
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';

import type { AuthContextValue } from '../auth';

interface RouterContext {
  auth: AuthContextValue;
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
    </>
  );
}
