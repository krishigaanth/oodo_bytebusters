import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { AUTH_CONFIG } from '../mocks/mockUsers';
import { FormInput } from '../components/common/FormInput';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, error: authError } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginId, setLoginId] = useState('EMP001');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginId.trim()) {
      setErrorMessage('Please enter your Employee Login ID (e.g. EMP001).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginId, password);
      success('Welcome back to Dayflow HRMS!', 'Signed In');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (id: string, pass: string) => {
    setLoginId(id);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-glow mb-4 text-white">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dayflow HRMS</h1>
        <p className="mt-1.5 text-sm text-slate-300 font-medium">
          Employee Self-Service & Attendance Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your corporate employee credentials to continue
            </p>
          </div>

          {(errorMessage || authError) && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fade-in font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Employee Login ID"
              placeholder="e.g. EMP001"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <FormInput
              label="Account Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                onClick={() => setErrorMessage('Please contact your HR administrator to reset your password.')}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2"
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Demo Employee Credentials</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Click below to autofill centralized test credentials:
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => fillQuickCredentials('EMP001', 'password123')}
                className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-center transition-colors flex items-center justify-center gap-1"
              >
                {loginId === 'EMP001' && <Check className="w-3 h-3 text-emerald-600" />}
                <span>Alex Morgan (EMP001)</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('EMP002', 'password123')}
                className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-center transition-colors flex items-center justify-center gap-1"
              >
                {loginId === 'EMP002' && <Check className="w-3 h-3 text-emerald-600" />}
                <span>Marcus Vance (EMP002)</span>
              </button>
            </div>
          </div>

          {/* Public Signup Toggle Flag */}
          {AUTH_CONFIG.allowPublicSignup && (
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-bold text-brand-600 hover:text-brand-700"
                onClick={() => setErrorMessage('Public signup enabled in config. Ready for registration endpoint.')}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
