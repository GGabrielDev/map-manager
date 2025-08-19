export class HttpError extends Error{
    statusCode: number
    errorType: any
    origin: string

    constructor(message: string, statusCode: number, errorType: any, origin: string) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.origin = origin;
         Error.captureStackTrace?.(this, this.constructor);
    }
}