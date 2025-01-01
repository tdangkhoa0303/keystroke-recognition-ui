export const SESSION_DATA_KEY = 'SESSION_DATA';

export interface UserSessionData {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  pending: boolean;
}

export function getStoredSessionData(): UserSessionData | null {
  const storedData = localStorage.getItem(SESSION_DATA_KEY);
  try {
    return (storedData ? JSON.parse(storedData) : null) || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function storeSessionData(sessionData: UserSessionData | null) {
  if (sessionData) {
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
  } else {
    localStorage.removeItem(SESSION_DATA_KEY);
  }
}
