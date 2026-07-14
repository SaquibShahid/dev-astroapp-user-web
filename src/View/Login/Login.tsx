import { IconPhone, IconShieldCheck, IconShieldLock, IconLock } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../api/authService';
import Logo from '../../Components/Logo';
import { useAuthStore } from '../../store/useAuthStore';
import OtpInput from './components/OtpInput';

type Step = 'mobile' | 'otp';

const RESEND_SECONDS = 30;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [step, setStep] = useState<Step>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'mobile') {
      phoneInputRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const startResendTimer = () => {
    setTimer(RESEND_SECONDS);
    setCanResend(false);
  };

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    const res = await authService.sendOtp(mobileNumber, 'login');
    if (res.status === 'success' && res.data) {
      setOtpId(res.data);
      setOtp('');
      setStep('otp');
      startResendTimer();
      toast.success('OTP sent successfully!');
    } else {
      toast.error(res.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    const res = await authService.verifyOtpAndLogin(mobileNumber, otpId, otp);
    if (res.success) {
      login(res.user);
      const { from } = (location.state as { from?: string } | null) || {};
      navigate(from || '/', { replace: true });
    } else {
      toast.error(res.message || 'Verification failed');
    }
    setLoading(false);
  };

  const handleChangeNumber = () => {
    setStep('mobile');
    setOtp('');
    setTimer(0);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen w-full bg-primary flex flex-col items-center px-4 py-12">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Logo />
        <p className="text-white/80 font-medium">Connect with Expert Astrologers</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">Welcome</h1>

        {step === 'mobile' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-main">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light">
                  <IconPhone size={20} stroke={2} />
                </span>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full h-14 pl-12 pr-4 bg-bg-soft border border-border rounded-2xl focus:outline-none focus:border-primary transition-colors text-base"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={mobileNumber.length !== 10 || loading}
              className="w-full h-14 rounded-2xl font-bold text-white bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <p className="text-center text-xs text-text-muted">
              By signing up, you agree to our{' '}
              <span className="text-primary font-medium">Terms of Service</span> and{' '}
              <span className="text-primary font-medium">Privacy Policy</span>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-bg-soft rounded-2xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white rounded-xl text-primary shadow-sm">
                  <IconPhone size={20} stroke={2} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-text-light font-semibold uppercase tracking-wider block">
                    Mobile Number
                  </span>
                  <span className="font-bold text-text-main">{mobileNumber}</span>
                </div>
              </div>
              <button
                onClick={handleChangeNumber}
                className="text-primary text-sm font-bold hover:opacity-80 transition-opacity flex-shrink-0"
              >
                Change
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-text-main">Enter OTP</label>
              <OtpInput length={6} value={otp} onChange={setOtp} disabled={loading} />
              <div className="flex justify-center">
                {canResend ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-primary text-sm font-bold hover:opacity-80 transition-opacity"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-text-muted text-sm">
                    Resend OTP in <span className="text-primary font-semibold">{timer}s</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              className="w-full h-14 rounded-2xl font-bold text-white bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <p className="text-center text-xs text-text-muted">
              By signing up, you agree to our{' '}
              <span className="text-primary font-medium">Terms of Service</span> and{' '}
              <span className="text-primary font-medium">Privacy Policy</span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[13px] font-semibold text-white/90">
          <IconLock size={16} className="text-accent" />
          100% Confidential
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[13px] font-semibold text-white/90">
          <IconShieldCheck size={16} className="text-accent" />
          Verified Astrologers
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[13px] font-semibold text-white/90">
          <IconShieldLock size={16} className="text-accent" />
          Secure Payments
        </div>
      </div>
    </div>
  );
};

export default Login;
