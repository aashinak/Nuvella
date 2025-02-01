import { body } from "express-validator";

export const uiUpdateDeleteValidationRules = () => {
  return [
    body("updateId")
      .notEmpty()
      .withMessage("Ui object id required")
      
      .withMessage("Ui object's ID must be a valid MongoDB ObjectId"),
  ];
};
