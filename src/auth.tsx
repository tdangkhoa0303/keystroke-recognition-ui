import {
  ReactNode,
  useState,
  useCallback,
  useContext,
  createContext,
} from 'react';

import { User } from './models/user';
import { useQuery } from '@tanstack/react-query';
import apiClient from './lib/api-client';
import { queryClient } from './lib/query-client';
import { getStoredAccessToken, storeAccessToken } from './lib/token';
import { Icons } from './components/ui/icons';
import { USER_PROFILE_QUERY_KEY } from './constants/query-keys';

export interface AuthContext {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (accessToken: string) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setStoredAccessToken] = useState<string | null>(
    getStoredAccessToken()
  );

  const { data: user = null, isFetched } = useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY],
    queryFn: () => apiClient.get<User>('/api/users/me').then((res) => res.data),
    enabled: !!accessToken,
    initialData: accessToken ? undefined : null,
  });

  const logout = useCallback(async () => {
    storeAccessToken(null);
    setStoredAccessToken(null);
    queryClient.removeQueries({
      queryKey: [USER_PROFILE_QUERY_KEY],
    });
  }, []);

  const login = useCallback(async (accessToken: string) => {
    storeAccessToken(accessToken);
    setStoredAccessToken(accessToken);
  }, []);

  if (accessToken && !isFetched) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
