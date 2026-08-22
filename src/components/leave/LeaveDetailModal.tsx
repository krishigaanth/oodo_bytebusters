import React from 'react';
import { Calendar, User, FileText, MessageSquareQuote } from 'lucide-react';
import { LeaveRequest } from '../../types/leave';
import { formatDateDisplay } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface LeaveDetailModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Application Details"
      subtitle={`Request ID: ${request.id}`}
      maxWidth="md"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <span className="text-xs text-slate-500 font-medium">Application Status</span>
            <div className="mt-1">
              <StatusBadge status={request.status} />
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Requested Duration</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {request.totalDays} {request.totalDays === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80">
            <span className="text-slate-500 font-medium">Leave Category</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{request.leaveType}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80">
            <span className="text-slate-500 font-medium">Submitted On</span>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {formatDateDisplay(request.appliedOn)}
            </p>
          </div>
        </div>

        {/* Date Schedule */}
        <div className="p-3.5 rounded-2xl bg-brand-50/50 border border-brand-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-brand-950">
            <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Duration</span>
              <p className="font-bold text-slate-900 text-sm">
                {formatDateDisplay(request.startDate)} &rarr; {formatDateDisplay(request.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Reason for Leave
          </span>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
            {request.reason}
          </div>
        </div>

        {/* Attachment */}
        {request.attachmentName && (
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Attached Document
            </span>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-brand-600 font-medium">
              <FileText className="w-4 h-4" />
              <span>{request.attachmentName}</span>
            </div>
          </div>
        )}

        {/* Reviewer / Approval Remarks (if reviewed) */}
        {request.reviewedBy && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Reviewed by {request.reviewedBy}</span>
            </div>
            {request.reviewerComments && (
              <div className="flex items-start gap-2 text-emerald-900 pl-6 text-xs italic">
                <MessageSquareQuote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>"{request.reviewerComments}"</p>
              </div>
            )}
            {request.reviewedOn && (
              <p className="text-[11px] text-slate-500 pl-6">
                Reviewed on: {formatDateDisplay(request.reviewedOn)}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
