import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Extending Error interface for custom ApiError properties
interface ApiError extends Error {
    statusCode?: number;
    errors?: string[]; // Optional field for validation or specific error messages
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
    if (statusCode === 500)
        logger.error(
            `Status: ${statusCode} - Message: ${err.message}`,
            err.errors
        );
    else
        logger.warn(
            `Status: ${statusCode} - Message: ${err.message}`,
            err.errors
        );

    // Send error response
    res.status(statusCode).json({
        success: false,
        status: "error",
        statusCode,
        message,
        ...(err.errors && { errors: err.errors }), // Include additional error details if available
    });
};

export default errorHandler;