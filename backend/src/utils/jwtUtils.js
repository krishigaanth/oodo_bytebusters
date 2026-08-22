import jwt from 'jsonwebtoken';

/**
 * Generate signed JWT token
 * @param {Object} payload - { userId, employeeId, role, email }
 * @returns {string} Signed JWT string
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_2026_hrms_production_grade';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_2026_hrms_production_grade';
  return jwt.verify(token, secret);
};
