import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";

    if (err.code === 'P2025') {
        statusCode = 404;
        message = "Requested record not found!";
    } 

    else if (err.code === 'P2002') {
        statusCode = 409; // Conflict
        message = "Duplicate data entry!";
    }

    else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401; // Unauthorized
        message = "Invalid or expired token!";
    }

    else if (err.name === 'ZodError') {
        statusCode = 400; // Bad Request
        message = "Input Validation Error!";
    }


    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
        errorDetails: err 
    });
};

export default globalErrorHandler;