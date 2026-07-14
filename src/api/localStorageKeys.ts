const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'auth_user_id';
const PASSWORD_KEY = 'auth_password';
const USER_DATA_KEY = 'auth_user_data';

export const TOKEN = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUserId = (): string | null => localStorage.getItem(USER_ID_KEY);

export const setUserId = (userId: string): void => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const getPassword = (): string | null => localStorage.getItem(PASSWORD_KEY);

export const setPassword = (password: string): void => {
  localStorage.setItem(PASSWORD_KEY, password);
};

export const getUserData = <T = unknown>(): T | null => {
  const raw = localStorage.getItem(USER_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setUserData = (data: unknown): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
};

export const clearSecureStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(PASSWORD_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};
