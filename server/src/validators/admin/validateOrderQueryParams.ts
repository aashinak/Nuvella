import { query } from "express-validator";

export const validateOrderQueryParams =  [
  query("pageIndex")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page index must be a positive integer")
    .toInt(),

  query("filterCondition")
    .optional()
    .isIn(["today", "month", "year"])
    .withMessage('Filter condition must be one of "today", "month", or "year"'),

  query("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12")
    .toInt(),

  query("year")
    .optional()
    .isInt()
    .withMessage("Year must be a valid integer")
    .toInt(),
];
