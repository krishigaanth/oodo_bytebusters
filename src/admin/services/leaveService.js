/**
 * Dayflow HRMS - Leave / Time Off Service
 * Isolated data layer mimicking Odoo 'hr.leave' model
 */
import { INITIAL_LEAVE_REQUESTS } from './mockData';
import { api } from './api';

const STORAGE_KEY = 'dayflow_leaves_data';

function getStoredLeaves() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse leave data', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEAVE_REQUESTS));
  return INITIAL_LEAVE_REQUESTS;
}

function saveLeaves(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const leaveService = {
  /**
   * Get all time off / leave requests
   */
  async getAllRequests() {
    const remoteData = await api.get('/api/admin/leaves');
    if (remoteData && Array.isArray(remoteData) && remoteData.length > 0) {
      return remoteData;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...getStoredLeaves()]);
      }, 150);
    });
  },

  /**
   * Get leave requests for specific employee
   */
  async getRequestsByEmployee(employeeId) {
    const remoteData = await api.get(`/api/admin/leaves?employee_id=${employeeId}`);
    if (remoteData && Array.isArray(remoteData)) {
      return remoteData;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getStoredLeaves();
        const records = all.filter(r => r.employeeId === employeeId);
        resolve(records);
      }, 150);
    });
  },

  /**
   * Approve a leave request by HR Admin
   */
  async approveRequest(id) {
    const remoteData = await api.post(`/api/admin/leaves/${id}/approve`);
    if (remoteData) {
      return remoteData;
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredLeaves();
        const item = list.find(req => req.id === id);
        if (item) {
          item.status = 'Approved';
          item.approvedBy = 'HR Administrator';
          item.approvedDate = new Date().toISOString().split('T')[0];
          saveLeaves(list);
          resolve({ ...item });
        } else {
          reject(new Error(`Leave request ${id} not found`));
        }
      }, 200);
    });
  },

  /**
   * Reject a leave request with a specified reason
   */
  async rejectRequest(id, reason = 'Not approved by HR') {
    const remoteData = await api.post(`/api/admin/leaves/${id}/reject`, { reason });
    if (remoteData) {
      return remoteData;
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredLeaves();
        const item = list.find(req => req.id === id);
        if (item) {
          item.status = 'Rejected';
          item.rejectedBy = 'HR Administrator';
          item.rejectedDate = new Date().toISOString().split('T')[0];
          item.rejectReason = reason;
          saveLeaves(list);
          resolve({ ...item });
        } else {
          reject(new Error(`Leave request ${id} not found`));
        }
      }, 200);
    });
  },

  /**
   * Submit a new leave application
   */
  async submitRequest(reqData) {
    const remoteData = await api.post('/api/admin/leaves', reqData);
    if (remoteData) {
      return remoteData;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredLeaves();
        const newReq = {
          id: `LV-${500 + list.length + 1}`,
          status: 'Pending',
          submittedDate: new Date().toISOString().split('T')[0],
          rejectReason: null,
          ...reqData
        };
        list.unshift(newReq);
        saveLeaves(list);
        resolve(newReq);
      }, 250);
    });
  }
};
