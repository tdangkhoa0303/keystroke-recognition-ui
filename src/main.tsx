import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';

import { queryClient } from './lib/query-client';
import './styles.css';
import { AuthProvider, useAuth } from './auth';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './components/theme-provider';
import TypingContext, { TypingInstance } from './context';
import TypingDNA from './vendors/tdna';

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const [tdnaInstance, setTdnaInstance] = useState<TypingInstance | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setTdnaInstance(new TypingDNA());
  }, []);

  return (
    <TypingContext value={tdnaInstance}>
      <RouterProvider router={router} context={{ auth }} />
    </TypingContext>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
