import { urlApi } from './urlApi';
import { postApi } from './callApi';
import { setUserId, setPassword } from './localStorageKeys';
import type { User } from '../store/useAuthStore';

type OtpContext = 'login' | 'signup' | 'forgot_password' | 'verify_mobile';

interface LoginResponseData {
  userId: string;
  password: string;
}

interface AutoLoginResponseData extends User {
  password: string;
}

export const authService = {
  /**
   * Sends an OTP to the given mobile number. Returns the otpId (in `data`)
   * needed for the following login call.
   */
  sendOtp: async (mobileNumber: string, context: OtpContext = 'login') => {
    return await postApi<string>(urlApi.auth.otpSend, { mobileNumber, context });
  },

  /**
   * Verifies the OTP and completes login in two backend calls:
   * 1. auth/login exchanges the OTP for a one-time userId/password pair.
   * 2. auth/auto-login exchanges that pair for a JWT (returned via the
   *    Authorization response header, captured automatically in callApi.ts).
   */
  verifyOtpAndLogin: async (mobileNumber: string, otpId: string, otp: string) => {
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

    const autoLoginRes = await postApi<AutoLoginResponseData>(urlApi.auth.autoLogin, {
      userId,
      password,
      deviceId: '',
      fcmToken: '',
    });

    if (autoLoginRes.status !== 'success' || !autoLoginRes.data) {
      return { success: false, message: autoLoginRes.message || 'Verification failed' };
    }

    const { password: rotatedPassword, ...user } = autoLoginRes.data;
    setPassword(rotatedPassword);

    return { success: true, user: user as User };
  },
};
