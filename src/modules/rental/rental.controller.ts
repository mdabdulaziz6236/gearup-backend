import { Request, Response, NextFunction } from "express";

import { RentalService } from "./rental.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const result = await RentalService.createRentalOrder(customerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental order placed successfully",
        data: result
    });
});

const getCustomerOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const result = await RentalService.getCustomerOrders(customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental orders retrieved successfully",
        data: result
    });
});

const getRentalOrderById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;
    const result = await RentalService.getRentalOrderById(req.params.id as string, customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental order details retrieved successfully",
        data: result
    });
});

export const RentalController = {
    createRentalOrder,
    getCustomerOrders,
    getRentalOrderById
};