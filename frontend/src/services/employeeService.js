/**
 * Dayflow HRMS - Employee Service
 * Isolated data layer mimicking Odoo 'hr.employee' model
 */
import { INITIAL_EMPLOYEES } from './mockData';

const STORAGE_KEY = 'dayflow_employees_data';

// Helper for simulated persistence
function getStoredEmployees() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse stored employees', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
  return INITIAL_EMPLOYEES;
}

function saveEmployees(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const employeeService = {
  /**
   * Get all employees list
   */
  async getEmployees() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...getStoredEmployees()]);
      }, 150);
    });
  },

  /**
   * Get single employee by ID
   */
  async getEmployeeById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredEmployees();
        const found = list.find(emp => emp.id === id);
        if (found) {
          resolve({ ...found });
        } else {
          reject(new Error(`Employee with ID ${id} not found`));
        }
      }, 150);
    });
  },

  /**
   * Update employee details
   */
  async updateEmployee(id, updatedData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredEmployees();
        const index = list.findIndex(emp => emp.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updatedData };
          saveEmployees(list);
          resolve({ ...list[index] });
        } else {
          reject(new Error(`Employee ${id} not found to update`));
        }
      }, 200);
    });
  },

  /**
   * Add a new employee
   */
  async addEmployee(newEmployee) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredEmployees();
        const newId = `EMP-${1000 + list.length + 1}`;
        const employee = {
          id: newId,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          attendanceStatus: 'Present',
          joiningDate: new Date().toISOString().split('T')[0],
          payFrequency: 'Monthly',
          workingDaysPerWeek: 5,
          breakTime: '1 Hour',
          ...newEmployee
        };
        list.unshift(employee);
        saveEmployees(list);
        resolve(employee);
      }, 250);
    });
  }
};
