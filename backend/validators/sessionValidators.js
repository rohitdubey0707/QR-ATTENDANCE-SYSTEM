import { body, param } from 'express-validator';


export const createSessionRules = [
body('title').trim().notEmpty(),
body('course').optional().isString(),
body('validFrom').isISO8601().toDate(),
body('validUntil').isISO8601().toDate()
];


export const sessionIdParam = [param('id').isMongoId()];