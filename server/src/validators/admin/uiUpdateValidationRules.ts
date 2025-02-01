import { body } from "express-validator";

// Validation rules for UI update, including file validation
export const uiUpdateValidationRules = () => {
  return [
    // // Validate that a file exists and meets requirements
    // body("heroImage").custom((_, { req }) => {
    //   if (!req.file) {
    //     throw new Error("Hero image file is required");
    //   }

    //   // Validate file type
    //   const allowedMimeTypes = ["image/jpeg", "image/png"];
    //   if (!allowedMimeTypes.includes(req.file.mimetype)) {
    //     throw new Error("Invalid file type. Only JPEG and PNG are allowed");
    //   }

    //   // Validate file size (2MB limit)
    //   const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    //   if (req.file.size > maxSizeInBytes) {
    //     throw new Error("File size exceeds 2MB");
    //   }

    //   return true; // Validation passed
    // }),

     // Validate heroText
     body("heroText")
     .trim()
     .notEmpty()
     .withMessage("Hero text is required")
     .isString()
     .withMessage("Hero text must be a string"),

   // Validate subText1
   body("subText1")
     .trim()
     .notEmpty()
     .withMessage("Subtext1 is required")
     .isString()
     .withMessage("Subtext1 must be a string"),

   // Validate subText2
   body("subText2")
     .trim()
     .notEmpty()
     .withMessage("Subtext2 is required")
     .isString()
     .withMessage("Subtext2 must be a string"),
  ];
};
