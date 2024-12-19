import { ValidationError } from "express-validator";
import logger from "./logger";
import ApiError from "./apiError";

// Type-safe validation error handler
const validationErrorHandler = (errors: ValidationError[]) => {
    const errorMessages = errors.map((error) => error.msg);

    // Log validation errors
    logger.warn(`Validation error ::: ${errorMessages}`);

    // Throw custom ApiError with validation errors
    throw new ApiError(400, "Validation Error", errorMessages);
};

export default validationErrorHandler;