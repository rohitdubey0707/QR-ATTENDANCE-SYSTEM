import { body } from 'express-validator';


export const registerRules = [
body('name').trim().notEmpty().withMessage('Name is required'),
body('email').isEmail().withMessage('Valid email required'),
body('password').isLength({ min: 6 }).withMessage('Password >= 6 chars'),
body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Invalid role'),
body('studentId').optional().isString()
];


export const loginRules = [
body('email').isEmail(),
body('password').notEmpty()
];