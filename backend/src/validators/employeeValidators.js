import { body } from 'express-validator';

export const updateProfileValidator = [
  body('personalEmail')
    .optional()
    .isEmail()
    .withMessage('Personal email must be a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('aboutBio')
    .optional()
    .trim(),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),
  body('address')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('state')
    .optional()
    .trim(),
  body('postalCode')
    .optional()
    .trim(),
  body('country')
    .optional()
    .trim(),
  body('emergencyContactName')
    .optional()
    .trim(),
  body('emergencyContactRelationship')
    .optional()
    .trim(),
  body('emergencyContactPhone')
    .optional()
    .trim(),
];
