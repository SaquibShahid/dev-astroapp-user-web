export interface ApiResult<T = unknown> {
  status: 'success' | 'failed';
  data: T | null;
  message: string;
  responseCode?: number;
}

export type RequestPayload = Record<string, unknown> | FormData;
