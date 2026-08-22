/**
 * Dayflow HRMS - Salary Service
 * Isolated data layer mimicking Odoo Payroll & Salary Structure Configuration
 */
import { INITIAL_SALARY_COMPONENTS, INITIAL_EMPLOYEES } from './mockData';
import { calculateFullSalaryBreakdown } from './salaryCalculations';

const COMPONENTS_STORAGE_KEY = 'dayflow_salary_components';
const EMPLOYEES_STORAGE_KEY = 'dayflow_employees_data';

function getStoredComponents() {
  const data = localStorage.getItem(COMPONENTS_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse stored components', e);
    }
  }
  localStorage.setItem(COMPONENTS_STORAGE_KEY, JSON.stringify(INITIAL_SALARY_COMPONENTS));
  return INITIAL_SALARY_COMPONENTS;
}

function saveComponents(list) {
  localStorage.setItem(COMPONENTS_STORAGE_KEY, JSON.stringify(list));
}

export const salaryService = {
  /**
   * Get all global salary components
   */
  async getComponents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...getStoredComponents()]);
      }, 150);
    });
  },

  /**
   * Save or update a salary component
   */
  async saveComponent(componentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredComponents();
        if (componentData.id) {
          const index = list.findIndex(c => c.id === componentData.id);
          if (index !== -1) {
            list[index] = { ...list[index], ...componentData };
          }
        } else {
          const newId = `COMP-${String(list.length + 1).padStart(2, '0')}`;
          list.push({
            id: newId,
            enabled: true,
            category: 'Earning',
            ...componentData
          });
        }
        saveComponents(list);
        resolve(componentData);
      }, 200);
    });
  },

  /**
   * Delete a salary component
   */
  async deleteComponent(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = getStoredComponents();
        list = list.filter(c => c.id !== id);
        saveComponents(list);
        resolve({ success: true, id });
      }, 200);
    });
  },

  /**
   * Get employee salary breakdown
   */
  async getEmployeeSalary(employeeId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rawEmps = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
        const emps = rawEmps ? JSON.parse(rawEmps) : INITIAL_EMPLOYEES;
        const emp = emps.find(e => e.id === employeeId);
        
        if (!emp) {
          reject(new Error(`Employee ${employeeId} not found`));
          return;
        }

        const components = emp.components || getStoredComponents();
        const breakdown = calculateFullSalaryBreakdown(emp.monthlyWage, components);
        
        resolve({
          employeeId: emp.id,
          employeeName: emp.name,
          jobTitle: emp.jobTitle,
          department: emp.department,
          payFrequency: emp.payFrequency || 'Monthly',
          workingDaysPerWeek: emp.workingDaysPerWeek || 5,
          breakTime: emp.breakTime || '1 Hour',
          breakdown,
          components
        });
      }, 150);
    });
  },

  /**
   * Update employee salary parameters (wage, components, etc.)
   */
  async updateEmployeeSalary(employeeId, { monthlyWage, components }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rawEmps = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
        const emps = rawEmps ? JSON.parse(rawEmps) : INITIAL_EMPLOYEES;
        const index = emps.findIndex(e => e.id === employeeId);

        if (index === -1) {
          reject(new Error(`Employee ${employeeId} not found`));
          return;
        }

        if (monthlyWage !== undefined) {
          emps[index].monthlyWage = Number(monthlyWage);
        }
        if (components !== undefined) {
          emps[index].components = components;
        }

        localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(emps));
        const breakdown = calculateFullSalaryBreakdown(emps[index].monthlyWage, emps[index].components || getStoredComponents());
        
        resolve({
          employeeId,
          monthlyWage: emps[index].monthlyWage,
          components: emps[index].components,
          breakdown
        });
      }, 200);
    });
  }
};
