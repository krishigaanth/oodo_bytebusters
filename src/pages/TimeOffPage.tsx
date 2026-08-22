import React, { useState, useEffect } from 'react';
import { Plus, Eye, History, FileText } from 'lucide-react';
import { LeaveBalance, LeaveRequest } from '../types/leave';
import { leaveService } from '../services/leaveService';
import { useAuth } from '../contexts/AuthContext';
import { formatDateDisplay } from '../utils/dateUtils';
import { LeaveBalanceCard } from '../components/leave/LeaveBalanceCard';
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';
import { LeaveDetailModal } from '../components/leave/LeaveDetailModal';
import { DataTable, ColumnDef } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';

export const TimeOffPage: React.FC = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const loadLeaveData = async () => {
    const empId = user?.employeeId || user?.id || 'EMP001';
    setIsLoading(true);
    try {
      const [balData, reqData] = await Promise.all([
        leaveService.getLeaveBalance(empId),
        leaveService.getLeaveRequests(empId),
      ]);
      setBalances(balData);
      setRequests(reqData);
    } catch (err) {
      console.error('Failed to load leave records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, [user]);

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      key: 'leaveType',
      header: 'Leave Category',
      render: (req) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm">{req.leaveType}</span>
          {req.attachmentName && (
            <span title="Has attachment" className="text-slate-400">
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Date Range',
      render: (req) => (
        <span className="text-slate-700 font-medium">
          {formatDateDisplay(req.startDate)} &rarr; {formatDateDisplay(req.endDate)}
        </span>
      ),
    },
    {
      key: 'totalDays',
      header: 'Days',
      render: (req) => (
        <span className="font-bold text-slate-900">
          {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
        </span>
      ),
    },
    {
      key: 'appliedOn',
      header: 'Submitted On',
      render: (req) => (
        <span className="text-slate-500 text-xs">{formatDateDisplay(req.appliedOn)}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason / Remarks',
      render: (req) => (
        <span className="text-xs text-slate-600 truncate max-w-xs block">{req.reason}</span>
      ),
    },
    {
      key: 'status',
      header: 'Approval Status',
      render: (req) => <StatusBadge status={req.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (req) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedRequest(req)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar with trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Time Off & Leave Balance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor your accrued PTO, apply for vacation or sick days, and check application status.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsApplyModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((balance) => (
          <LeaveBalanceCard key={balance.leaveType} balance={balance} />
        ))}
      </div>

      {/* Leave Application History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Leave Application History
            </h3>
          </div>
          <span className="text-xs text-slate-500">{requests.length} total applications</span>
        </div>

        <DataTable
          columns={columns}
          data={requests}
          isLoading={isLoading}
          keyExtractor={(req) => req.id}
          onRowClick={(req) => setSelectedRequest(req)}
          emptyTitle="No leave applications submitted"
          emptyDescription="You haven't requested any time off yet. Click 'Apply for Leave' to submit a request."
        />
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        balances={balances}
        onSuccess={loadLeaveData}
      />

      {/* Leave Details Modal */}
      <LeaveDetailModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
