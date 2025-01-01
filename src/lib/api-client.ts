import axios, { AxiosError } from 'axios';
import { getStoredSessionData } from './token';

const { VITE_API_ENDPOINT } = import.meta.env;

const apiClient = axios.create({
  baseURL: `${VITE_API_ENDPOINT}`,
  headers: { 'Content-Type': 'application/json' },
});

const { accessToken } = getStoredSessionData() ?? {};

if (accessToken)
  apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

apiClient.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error: AxiosError) => Promise.reject(error)
);

export default apiClient;
