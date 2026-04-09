import { body, query } from "express-validator";

//  Validation rules for marking attendance (student side)
export const markRules = [
  body("sessionCode")
    .trim()
    .notEmpty()
    .withMessage("sessionCode is required"),
];

// Validation rules for fetching attendance report (teacher/admin side)
export const reportRules = [
  query("sessionId")
    .isMongoId()
    .withMessage("sessionId must be a valid MongoDB ObjectId"),
];
