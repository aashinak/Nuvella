import { body } from "express-validator";

export const createDiscountValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Discount name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Discount name must be between 3 and 50 characters"),

  body("discount_percentage")
    .notEmpty()
    .withMessage("Discount percentage is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percentage must be a number between 0 and 100"),
];
