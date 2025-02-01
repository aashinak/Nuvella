import { param } from "express-validator";

export const validateCategoryId = () => [
  param("categoryId")
    .trim()
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),
];
