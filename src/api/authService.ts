import { urlApi } from './urlApi';
import { postApi } from './callApi';
import { setUserId, setPassword, getUserId, getPassword } from './localStorageKeys';
import type { User } from '../store/useAuthStore';

type OtpContext = 'login' | 'signup' | 'forgot_password' | 'verify_mobile';

interface LoginResponseData {
  userId: string;
  password: string;
}

interface AutoLoginResponseData extends User {
  password: string;
}

type AuthResult = { success: true; user: User } | { success: false; message?: string };

// Exchanges a userId/password pair for a JWT (returned via the Authorization
// response header, captured automatically in callApi.ts).
const performAutoLogin = async (userId: string, password: string): Promise<AuthResult> => {
  const res = await postApi<AutoLoginResponseData>(urlApi.auth.autoLogin, {
    userId,
    password,
    deviceId: '',
    fcmToken: '',
  });

  if (res.status !== 'success' || !res.data) {
    return { success: false, message: res.message || 'Session expired' };
  }

  const { password: rotatedPassword, ...user } = res.data;
  setPassword(rotatedPassword);

  return { success: true, user: user as User };
};

export const authService = {
  /**
   * Sends an OTP to the given mobile number. Returns the otpId (in `data`)
   * needed for the following login call.
   */
  sendOtp: async (mobileNumber: string, context: OtpContext = 'login') => {
    return await postApi<string>(urlApi.auth.otpSend, { mobileNumber, context });
  },

  /**
   * Verifies the OTP and completes login: auth/login exchanges the OTP for a
   * one-time userId/password pair, then auto-login exchanges that for a JWT.
   */
  verifyOtpAndLogin: async (mobileNumber: string, otpId: string, otp: string): Promise<AuthResult> => {
    const loginRes = await postApi<LoginResponseData>(urlApi.auth.login, {
      type: 'mobile',
      mobileNumber,
      otpId,
      otp,
      deviceId: '',
      guestUserId: '',
      guestPassword: '',
    });

    if (loginRes.status !== 'success' || !loginRes.data) {
      return { success: false, message: loginRes.message || 'Login failed' };
    }

    const { userId, password } = loginRes.data;
    setUserId(userId);
    setPassword(password);

    return performAutoLogin(userId, password);
  },

  /**
   * Re-authenticates using the userId/password pair stored from the last
   * login. Called once on app boot so a returning visitor gets a fresh
   * token instead of trusting whatever's left in localStorage.
   */
  autoLogin: async (): Promise<AuthResult> => {
    const userId = getUserId();
    const password = getPassword();
    if (!userId || !password) {
      return { success: false, message: 'No stored session' };
    }
    return performAutoLogin(userId, password);
  },
};
