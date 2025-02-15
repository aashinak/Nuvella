import { body } from "express-validator";

export const userRegistrationValidationRules = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 and 15 characters"),

  body("firstname")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must only contain alphabetic characters")
    .isLength({ min: 3, max: 15 })
    .withMessage("First name must be between 3 and 15 characters"),

  body("lastname")
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last name must only contain alphabetic characters and spaces")
    .isLength({ min: 2, max: 15 })
    .withMessage("Last name must be between 2 and 15 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>_\-]/)
    .withMessage("Password must contain at least one special character"),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid phone number"),
];
