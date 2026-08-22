import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

export const AttendanceTab = ({ employeeId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService.getAttendanceByEmployee(employeeId).then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, [employeeId]);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Clock size={18} color="var(--primary-600)" />
            Attendance History & Punch Logs
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Biometric check-in logs, work hours, and punctuality records
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Late Arrival</th>
              <th>Overtime</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                  No attendance history logged yet for this employee.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id}>
                  <td style={{ fontWeight: 600 }}>{rec.date}</td>
                  <td>{rec.checkIn}</td>
                  <td>{rec.checkOut}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rec.totalHours}</td>
                  <td>
                    <StatusBadge status={rec.status} />
                  </td>
                  <td>
                    {rec.late && rec.late.startsWith('Yes') ? (
                      <span style={{ color: 'var(--status-break)', fontWeight: 600 }}>{rec.late}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No</span>
                    )}
                  </td>
                  <td>
                    {rec.overtime && rec.overtime.startsWith('Yes') ? (
                      <span style={{ color: 'var(--status-present)', fontWeight: 600 }}>{rec.overtime}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
