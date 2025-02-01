class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors?: string[];
    additionalInfo?: Record<string, any>;
    stack?: string;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: string[] = [],
        additionalInfo: Record<string, any> = {},
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;

        // Conditionally set errors only if non-empty
        if (errors.length > 0) {
            this.errors = errors;
        }

        // Add additionalInfo if provided
        if (Object.keys(additionalInfo).length > 0) {
            this.additionalInfo = additionalInfo;
        }
        

        // Conditionally set the stack
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
