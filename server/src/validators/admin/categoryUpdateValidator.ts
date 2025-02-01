import { body } from "express-validator";

export const categoryUpdationValidationRules = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Category name must be at least 3 characters long")
      .matches(/^[a-zA-Z_]+$/)
      .withMessage("Category name must only contain alphabets and underscores"),
    body("categoryId")
      .notEmpty()
      .withMessage("Category ID is required")
      .isMongoId()
      .withMessage("Category ID must be a valid MongoDB ObjectId"),
  ];
};
