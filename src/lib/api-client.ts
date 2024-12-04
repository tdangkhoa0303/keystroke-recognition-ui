import axios, { AxiosError } from 'axios';
import { getStoredAccessToken } from './token';

export interface PaginatedResponse<TData> {
  data: TData[];
  meta: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemCount: number;
    page: number;
    pageCount: number;
    take: number;
  };
}

const { VITE_API_ENDPOINT } = import.meta.env;

const apiClient = axios.create({
  baseURL: `${VITE_API_ENDPOINT}`,
  headers: { 'Content-Type': 'application/json' },
});

const accessToken = getStoredAccessToken();

if (accessToken)
  apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

apiClient.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error: AxiosError) => Promise.reject(error)
);

export default apiClient;
