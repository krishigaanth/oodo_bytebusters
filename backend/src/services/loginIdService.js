import { User } from '../models/User.js';

/**
 * Generate standard Employee User ID based on exact formula:
 * [First 2 Letters of First Name] + [First 2 Letters of Last Name] + [4-Digit Year of Joining] + [3-Digit Serial in Year]
 * Example: John Smith joined in 2024 as 15th hire -> "JOSM2024015"
 */
export const generateEmployeeUserId = async ({
  firstName = 'John',
  lastName = 'Smith',
  joiningDate = new Date().toISOString(),
}) => {
  const f2 = (firstName.replace(/[^a-zA-Z]/g, '').slice(0, 2) || 'EM').toUpperCase().padEnd(2, 'X');
  const l2 = (lastName.replace(/[^a-zA-Z]/g, '').slice(0, 2) || 'US').toUpperCase().padEnd(2, 'X');
  const year = new Date(joiningDate).getFullYear() || new Date().getFullYear();
  
  const allYearPattern = new RegExp(`^[A-Z]{4}${year}\\d{3}$`, 'i');
  const existingInYear = await User.countDocuments({
    loginId: { $regex: allYearPattern }
  });

  let serial = existingInYear + 1;
  let candidateId = `${f2}${l2}${year}${String(serial).padStart(3, '0')}`;

  while (await User.exists({ loginId: candidateId })) {
    serial++;
    candidateId = `${f2}${l2}${year}${String(serial).padStart(3, '0')}`;
  }

  return candidateId;
};

/**
 * Backward compatible helper for existing admin onboarding
 */
export const generateUniqueLoginId = async (params) => {
  return generateEmployeeUserId(params);
};

/**
 * Generate sequential EMP-style employee IDs (e.g. EMP003)
 */
export const generateNextEmployeeId = async () => {
  const users = await User.find({ employeeId: { $regex: /^EMP\d+$/i } })
    .select('employeeId')
    .lean();

  let maxNum = 0;
  users.forEach((u) => {
    const num = parseInt(u.employeeId.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  });

  const nextNum = maxNum + 1;
  return `EMP${String(nextNum).padStart(3, '0')}`;
};
