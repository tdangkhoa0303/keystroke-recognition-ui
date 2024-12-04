export const ACCESS_TOKEN_KEY = 'access_token';

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
}

export function storeAccessToken(accessToken: string | null) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}
