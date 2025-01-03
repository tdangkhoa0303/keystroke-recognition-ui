import {
  ReactNode,
  useState,
  useCallback,
  useContext,
  createContext,
  useEffect,
  useMemo,
} from 'react';

import { User } from './models/user';
import { useQuery } from '@tanstack/react-query';
import apiClient from './lib/api-client';
import { queryClient } from './lib/query-client';
import {
  getStoredSessionData,
  storeSessionData,
  UserSessionData,
} from './lib/token';
import { USER_PROFILE_QUERY_KEY } from './constants/query-keys';
import Spinner from './components/ui/spinner';

export interface AuthContextValue {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (session: UserSessionData) => Promise<void>;
  user: User | null;
  sessionData: UserSessionData | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionData, setStoredSessionData] = useState<UserSessionData | null>(
    getStoredSessionData()
  );

  useEffect(() => {
    storeSessionData(sessionData);
  }, [sessionData]);

  const shouldFetchUserProfile = !!sessionData && sessionData.pending === false;
  const { data: user = null, isFetched } = useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY],
    queryFn: () => apiClient.get<User>('/api/users/me').then((res) => res.data),
    enabled: shouldFetchUserProfile,
    initialData: sessionData ? undefined : null,
  });

  const logout = useCallback(async () => {
    storeSessionData(null);
    setStoredSessionData(null);
    queryClient.removeQueries({
      queryKey: [USER_PROFILE_QUERY_KEY],
    });
  }, []);

  const login = useCallback(async (session: UserSessionData) => {
    setStoredSessionData(session);
  }, []);

  const authContextValue = useMemo(
    () => ({ isAuthenticated: !!user, sessionData, user, logout, login }),
    [login, logout, sessionData, user]
  );

  if (shouldFetchUserProfile && !isFetched) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        <Spinner loading />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
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
