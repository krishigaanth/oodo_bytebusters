import React, { useState, useEffect } from 'react';
import { Calendar, FileUp, AlertCircle, Info, Sparkles } from 'lucide-react';
import { LeaveBalance, LeaveType, ApplyLeavePayload } from '../../types/leave';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { calculateDaysBetween } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: LeaveBalance[];
  onSuccess: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  balances,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [reason, setReason] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto calculate duration whenever start or end dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateDaysBetween(startDate, endDate);
      setCalculatedDays(days);
      if (endDate < startDate) {
        setFormError('End date cannot be earlier than start date.');
      } else {
        setFormError(null);
      }
    } else if (startDate) {
      setCalculatedDays(1);
      setFormError(null);
    } else {
      setCalculatedDays(0);
      setFormError(null);
    }
  }, [startDate, endDate]);

  const selectedBalance = balances.find((b) => b.leaveType === leaveType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) return;

    if (!startDate || !endDate) {
      setFormError('Please choose both start and end dates.');
      return;
    }

    if (endDate < startDate) {
      setFormError('End date cannot be before start date.');
      return;
    }

    if (!reason.trim()) {
      setFormError('Please enter a reason for your leave request.');
      return;
    }

    if (selectedBalance && selectedBalance.available < calculatedDays) {
      setFormError(
        `Insufficient ${leaveType} balance. You are requesting ${calculatedDays} day(s), but have ${selectedBalance.available} available.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ApplyLeavePayload = {
        leaveType,
        startDate,
        endDate,
        totalDays: calculatedDays,
        reason: reason.trim(),
        attachmentName: attachmentFile ? attachmentFile.name : undefined,
      };

      await leaveService.applyLeave(user.employeeId, payload);
      success('Leave application submitted successfully for supervisor review.', 'Request Submitted');
      onSuccess();
      onClose();
      // Reset form
      setReason('');
      setStartDate('');
      setEndDate('');
      setAttachmentFile(null);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit leave application.');
      error(err?.message || 'Failed to submit leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Time Off / Leave"
      subtitle="Submit your leave application for manager approval"
      maxWidth="lg"
      footer={
        <div className="flex items-center gap-3 w-full justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Submit Application
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fade-in font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Leave Type Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Leave Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
          >
            {balances.map((b) => (
              <option key={b.leaveType} value={b.leaveType}>
                {b.leaveType} ({b.available} days available)
              </option>
            ))}
          </select>
          {selectedBalance && (
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-brand-500" />
              <span>
                Available Quota: <strong>{selectedBalance.available}</strong> / {selectedBalance.totalQuota} days
              </span>
            </p>
          )}
        </div>

        {/* Date Ranges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              End Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Computed Days Banner */}
        {calculatedDays > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50/70 border border-brand-200/80 text-brand-900 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span className="font-semibold">Estimated Working Days Requested:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-600 text-white font-bold text-xs">
              {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}

        {/* Reason / Remarks */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Reason & Notes <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please share context for this leave request..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 transition-all"
            required
          />
        </div>

        {/* Optional Document Attachment */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Supporting Document <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
          </label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors">
              <FileUp className="w-4 h-4 text-slate-500" />
              <span>{attachmentFile ? 'Replace File' : 'Upload Document (PDF, PNG)'}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => setAttachmentFile(e.target.files ? e.target.files[0] : null)}
              />
            </label>
            {attachmentFile && (
              <span className="text-xs text-brand-600 font-medium truncate max-w-xs">
                {attachmentFile.name}
              </span>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
