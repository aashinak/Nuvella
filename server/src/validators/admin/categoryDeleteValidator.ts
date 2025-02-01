import { body } from "express-validator";

export const categoryDeletionValidationRules = () => {
  return [
    body("categoryId")
      .notEmpty()
      .withMessage("Category ID is required")
      .isMongoId()
      .withMessage("Category ID must be a valid MongoDB ObjectId"),
  ];
};
