import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Laptop, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { EmployeeProfile } from '../../types/employee';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { FormInput } from '../common/FormInput';

interface SecurityTabProps {
  profile: EmployeeProfile;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ profile }) => {
  const { success, error } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const { securityInfo } = profile;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!currentPassword) {
      setFormError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      setFormSuccess(res.message);
      success('Your security password has been changed successfully.', 'Password Updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.message || 'Failed to update password. Please check your current password.';
      setFormError(msg);
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Form */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>
            <p className="text-xs text-slate-500">
              Ensure your password has at least 6 characters including numbers and symbols.
            </p>
          </div>
        </div>

        {formError && (
          <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fade-in font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <FormInput
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <FormInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimum 6 characters"
            required
          />

          <FormInput
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Status */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Enhanced authentication enabled via company authenticator policy.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Enforced & Active
        </span>
      </div>

      {/* Active Sessions & Login Activity */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Laptop className="w-4 h-4 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">Recent Login Activity</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Device & Client</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {securityInfo.loginActivity.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                    {log.device.includes('iPhone') ? (
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{log.device}</span>
                  </td>
                  <td className="px-4 py-3">{log.location}</td>
                  <td className="px-4 py-3 font-mono">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-slate-500">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
