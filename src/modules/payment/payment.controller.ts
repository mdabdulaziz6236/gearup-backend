import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const { rentalOrderId } = req.body;

    const result = await PaymentService.createPaymentIntent(customerId, rentalOrderId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment intent created successfully",
        data: result
    });
});

const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const { transactionId } = req.body;

    const result = await PaymentService.confirmPayment(customerId, transactionId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment confirmed successfully",
        data: result
    });
});

const getUserPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const result = await PaymentService.getUserPayments(customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payments retrieved successfully",
        data: result
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const { id } = req.params;

    const result = await PaymentService.getPaymentById(id as string, customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment details retrieved successfully",
        data: result
    });
});


export const PaymentController = {
    createPayment,
    confirmPayment,
    getUserPayments,
    getPaymentById
};