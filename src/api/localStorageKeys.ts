const TOKEN_KEY = 'auth_token';

export const TOKEN = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
