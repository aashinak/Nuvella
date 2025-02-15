import { param } from "express-validator";

export const validateDiscountId = () => [
  param("discountId")
    .trim()
    .notEmpty()
    .withMessage("Discount ID is required")
    .isMongoId()
    .withMessage("Discount ID must be a valid MongoDB ObjectId"),
];
