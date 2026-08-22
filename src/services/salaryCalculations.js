/**
 * Dayflow HRMS - Pure Salary & Tax Calculation Engine
 * Isolated calculation logic ready for Odoo payroll mapping
 */

/**
 * Format number into Indian Rupee currency format (₹XX,XXX)
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Calculate Basic Salary from Monthly Wage and percentage
 * @param {number} monthlyWage 
 * @param {number} percentage (Default: 50%)
 */
export function calculateBasicSalary(monthlyWage, percentage = 50) {
  if (!monthlyWage || monthlyWage <= 0) return 0;
  return (monthlyWage * percentage) / 100;
}

/**
 * Calculate House Rent Allowance (HRA) based on Basic Salary
 * @param {number} basicSalary 
 * @param {number} percentage (Default: 50% for metro / standard)
 */
export function calculateHRA(basicSalary, percentage = 50) {
  if (!basicSalary || basicSalary <= 0) return 0;
  return (basicSalary * percentage) / 100;
}

/**
 * Calculate standard Provident Fund (12% of Basic Salary)
 * @param {number} basicSalary 
 * @param {number} pfRate (Default: 0.12)
 */
export function calculatePF(basicSalary, pfRate = 0.12) {
  if (!basicSalary || basicSalary <= 0) return 0;
  return Math.round(basicSalary * pfRate);
}

/**
 * Calculate Professional Tax based on state slab rules (Standard: ₹200)
 * @param {number} monthlyWage 
 */
export function calculateProfessionalTax(monthlyWage) {
  if (!monthlyWage || monthlyWage <= 15000) return 0;
  return 200;
}

/**
 * Calculate dynamic component amount based on calculation type and base
 * @param {Object} component 
 * @param {number} monthlyWage 
 * @param {number} basicSalary 
 */
export function calculateComponentAmount(component, monthlyWage, basicSalary) {
  if (!component || !component.enabled) return 0;
  
  if (component.type === 'Fixed') {
    return Number(component.value) || 0;
  }
  
  if (component.type === 'Percentage') {
    const rate = (Number(component.value) || 0) / 100;
    if (component.basedOn === 'Basic Salary') {
      return basicSalary * rate;
    }
    return monthlyWage * rate;
  }
  
  return 0;
}

/**
 * Calculate total salary breakdown including Gross, Deductions, and Net Take-Home
 */
export function calculateFullSalaryBreakdown(monthlyWage, components = [], pfRate = 0.12) {
  const wage = Number(monthlyWage) || 0;
  
  // 1. Find basic component or use default 50%
  const basicComp = components.find(c => c.name.toLowerCase().includes('basic'));
  const basicPercentage = basicComp && basicComp.type === 'Percentage' ? Number(basicComp.value) : 50;
  const basicSalary = calculateBasicSalary(wage, basicPercentage);

  // 2. Calculate earnings components
  const calculatedComponents = components.map(comp => {
    let amount = 0;
    if (comp.name.toLowerCase().includes('basic')) {
      amount = basicSalary;
    } else if (comp.name.toLowerCase().includes('house rent') || comp.name.toLowerCase().includes('hra')) {
      amount = calculateComponentAmount(comp, wage, basicSalary);
    } else {
      amount = calculateComponentAmount(comp, wage, basicSalary);
    }
    return {
      ...comp,
      calculatedAmount: Math.round(amount)
    };
  });

  const totalEarnings = calculatedComponents.reduce((acc, curr) => acc + (curr.enabled ? curr.calculatedAmount : 0), 0);
  const grossSalary = totalEarnings > 0 ? totalEarnings : wage;

  // 3. Deductions
  const employeePF = calculatePF(basicSalary, pfRate);
  const employerPF = calculatePF(basicSalary, pfRate);
  const professionalTax = calculateProfessionalTax(wage);
  const totalDeductions = employeePF + professionalTax;

  // 4. Net Take-Home
  const netTakeHome = Math.max(0, grossSalary - totalDeductions);
  const yearlyWage = wage * 12;
  const yearlyGross = grossSalary * 12;
  const yearlyNet = netTakeHome * 12;

  return {
    monthlyWage: wage,
    yearlyWage,
    basicSalary,
    calculatedComponents,
    grossSalary,
    employeePF,
    employerPF,
    pfRate,
    professionalTax,
    totalDeductions,
    netTakeHome,
    yearlyGross,
    yearlyNet
  };
}
