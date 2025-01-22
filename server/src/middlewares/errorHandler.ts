import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Extending Error interface for custom ApiError properties
interface ApiError extends Error {
    statusCode?: number;
    errors?: string[]; // Optional field for validation or specific error messages
    additionalInfo?: Record<string, any>; // Optional field for extra information
}

const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const isInternalError = statusCode === 500;
    const message = isInternalError ? "Internal Server Error" : err.message;

    // Log the error for debugging purposes
    if (statusCode === 500) {
        logger.error(
            `Status: ${statusCode} - Message: ${err.message}`,
            {
                errors: err.errors,
                additionalInfo: err.additionalInfo,
                stack: err.stack,
            }
        );
    } else {
        logger.warn(
            `Status: ${statusCode} - Message: ${err.message}`,
            {
                errors: err.errors,
                additionalInfo: err.additionalInfo,
            }
        );
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        status: "error",
        statusCode,
        message,
        ...(err.errors && { errors: err.errors }), // Include specific error details if available
        ...(err.additionalInfo && { additionalInfo: err.additionalInfo }), // Include additional info if provided
    });
};

export default errorHandler;
