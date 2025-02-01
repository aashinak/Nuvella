import { body } from "express-validator";

export const categoryCreationValidationRules = () => {
  return [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name be a string"),
  ];
};
