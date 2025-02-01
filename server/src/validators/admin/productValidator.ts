import { body } from "express-validator";
import mongoose from "mongoose";
import logger from "../../utils/logger";

export const productValidationRules = () => [
  // Name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),

  // Description validation
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  // Price validation
  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),

  // CategoryId validation (MongoDB ObjectId)
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Category ID format"),

  // Stock validation
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

    body("sizes")
    .optional() // Makes the sizes field optional
    .custom((value) => {
      if (value) {
        let parsedSizes;
        try {
          parsedSizes = JSON.parse(value); // Parse stringified JSON
        } catch (error) {
          throw new Error("Sizes must be a valid JSON array");
        }
  
        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
          throw new Error("Sizes must be an array with at least one size object");
        }
  
        parsedSizes.forEach((size: any) => {
          if (!size.size || typeof size.size !== "string") {
            throw new Error("Each size must have a 'size' field of type string");
          }
          if (size.stock === undefined || size.stock < 0) {
            throw new Error("Each size must have a 'stock' field as a non-negative integer");
          }
        });
      }
      return true;
    }),
  

  // DiscountId validation (optional MongoDB ObjectId)
  body("discountId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Discount ID format"),
];
