export class HttpError extends Error{
    statusCode: number
    errorType: any
    details: {
        [key: string]: any
    }

    constructor(message: string, statusCode: number, errorType: any, details: { [key: string]: any }) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.details = details;
        Error.captureStackTrace?.(this, this.constructor);
    }
}