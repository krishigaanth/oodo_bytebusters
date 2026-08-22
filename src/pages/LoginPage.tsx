import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Check, Building2, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FormInput } from '../components/common/FormInput';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user, error: authError } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRoleTab, setActiveRoleTab] = useState<'admin' | 'employee'>('admin');
  const [loginId, setLoginId] = useState('ADMIN001');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already authenticated based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'hr') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleTabChange = (role: 'admin' | 'employee') => {
    setActiveRoleTab(role);
    setErrorMessage(null);
    if (role === 'admin') {
      setLoginId('ADMIN001');
      setPassword('admin123');
    } else {
      setLoginId('EMP001');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginId.trim()) {
      setErrorMessage('Please enter your Login ID or Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginId, password);
      success(`Welcome to Dayflow HRMS!`, 'Signed In');
      if (activeRoleTab === 'admin' || loginId.toUpperCase().includes('ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (id: string, pass: string, role: 'admin' | 'employee') => {
    setActiveRoleTab(role);
    setLoginId(id);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Lighting background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-glow mb-4 text-white">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dayflow HRMS</h1>
        <p className="mt-1.5 text-sm text-slate-300 font-medium">
          Unified Enterprise HR & Employee Self-Service Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/80 space-y-6">

          {/* Unified Role Selector Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeRoleTab === 'admin'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>HR Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('employee')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeRoleTab === 'employee'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Employee Portal</span>
            </button>
          </div>

          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              {activeRoleTab === 'admin' ? 'HR Administrator Login' : 'Employee Self-Service Login'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeRoleTab === 'admin'
                ? 'Sign in to access organizational settings, employee directory, & payroll'
                : 'Sign in to view personal profile, mark attendance, & submit leave requests'}
            </p>
          </div>

          {(errorMessage || authError) && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label={activeRoleTab === 'admin' ? 'Admin / HR ID' : 'Employee Login ID'}
              placeholder={activeRoleTab === 'admin' ? 'e.g. ADMIN001' : 'e.g. EMP001'}
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2"
            >
              Sign In to {activeRoleTab === 'admin' ? 'HR Admin Portal' : 'Employee Portal'}
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Centralized Demo Logins</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                One-Click Autofill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => fillQuickCredentials('ADMIN001', 'admin123', 'admin')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                  activeRoleTab === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {activeRoleTab === 'admin' && <Check className="w-3 h-3 text-white" />}
                <span>HR Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('EMP001', 'password123', 'employee')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                  activeRoleTab === 'employee'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {activeRoleTab === 'employee' && <Check className="w-3 h-3 text-white" />}
                <span>Employee</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
