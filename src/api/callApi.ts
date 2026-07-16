import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { TOKEN, setToken, getUserId, clearSecureStorage } from './localStorageKeys';
import type { ApiResult, RequestPayload } from './types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Routes that don't require an auth token (e.g. login, otp, public content).
// Add to this list as needed — everything else requires a token.
const PUBLIC_ROUTES: string[] = [
  'auth/otp-send',
  'auth/login',
  'auth/auto-login',
];

let isRedirecting = false;

const handleUnauthorized = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  clearSecureStorage();
  window.location.href = '/login';
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'x-app-id': import.meta.env.VITE_APP_ID || '',
    'x-app-platform': 'web',
    'x-app-version': import.meta.env.VITE_APP_VERSION || '',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const relativeUrl = (config.url || '').replace(BASE_URL, '').replace(/^\/+/, '').split('?')[0];
    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => relativeUrl === route || relativeUrl.startsWith(`${route}/`)
    );

    const token = TOKEN();
    if (!isPublicRoute && !token) {
      handleUnauthorized();
      return Promise.reject({ data: null, message: 'Unauthorized - No token found', status: 'failed' });
    }

    config.headers.set('Accept', 'application/json');
    if (token && !isPublicRoute) {
      config.headers.set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
    }

    const userId = getUserId();
    if (userId) {
      config.headers.set('x-user-id', userId);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  // Return type is intentionally widened to `any`: this interceptor unwraps
  // AxiosResponse down to just `response.data`, which axios's own types don't
  // model (they expect the fulfilled handler to still return an AxiosResponse).
  (response: AxiosResponse<ApiResult>): any => {
    const refreshedToken = response.headers['authorization'];
    if (refreshedToken) setToken(refreshedToken);
    return response.data;
  },
  (error: AxiosError): any => {
    if (error.response?.status === 401) {
      handleUnauthorized();
      return Promise.reject<ApiResult>({ data: null, message: 'Unauthorized - Please login again', status: 'failed' });
    }

    const responseData = error.response?.data as ApiResult | undefined;
    return Promise.reject<ApiResult>(
      responseData || { data: null, message: error.message || 'An unexpected error occurred', status: 'failed' }
    );
  }
);

const formatError = <T>(error: unknown): ApiResult<T> => {
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    return error as ApiResult<T>;
  }
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return { data: null, message, status: 'failed' };
};

export const getApi = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<ApiResult<T>> => {
  try {
    return await apiClient.get<never, ApiResult<T>>(url, { params, headers });
  } catch (error) {
    return formatError<T>(error);
  }
};

export const postApi = async <T = unknown>(url: string, data: RequestPayload): Promise<ApiResult<T>> => {
  try {
    return await apiClient.post<never, ApiResult<T>>(url, data);
  } catch (error) {
    return formatError<T>(error);
  }
};

export const putApi = async <T = unknown>(url: string, data: RequestPayload): Promise<ApiResult<T>> => {
  try {
    return await apiClient.put<never, ApiResult<T>>(url, data);
  } catch (error) {
    return formatError<T>(error);
  }
};

export const patchApi = async <T = unknown>(url: string, data: RequestPayload): Promise<ApiResult<T>> => {
  try {
    return await apiClient.patch<never, ApiResult<T>>(url, data);
  } catch (error) {
    return formatError<T>(error);
  }
};

export const deleteApi = async <T = unknown>(url: string): Promise<ApiResult<T>> => {
  try {
    return await apiClient.delete<never, ApiResult<T>>(url);
  } catch (error) {
    return formatError<T>(error);
  }
};
