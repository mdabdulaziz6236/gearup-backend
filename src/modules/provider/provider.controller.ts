import { Request, Response, NextFunction } from "express";

import { ProviderService } from "./provider.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OrderStatus } from "../../../generated/prisma/enums";

const addGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = (req as any).user.id;
    const result = await ProviderService.addGear(providerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Gear created successfully",
        data: result
    });

});

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = (req as any).user.id;
    const result = await ProviderService.updateGear(req.params.id as string, providerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear Updated Successfully",
        data: result
    })
});

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = (req as any).user.id;
    await ProviderService.deleteGear(req.params.id as string, providerId);

    sendResponse(res,
        {
            success: true,
            statusCode: httpStatus.OK,
            message: "Gear deleted successfully",
            data: {}
        });
});


const getIncomingOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = (req as any).user.id;
    const result = await ProviderService.getIncomingOrders(providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Incoming orders retrieved successfully",
        data: result
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = (req as any).user.id;
    const { id } = req.params;
    const { status } = req.body;

    const result = await ProviderService.updateOrderStatus(id as string, providerId, status as OrderStatus);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order status updated successfully",
        data: result
    });
});


const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    
    const result = await ProviderService.getProviderStats(providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Provider dashboard stats retrieved successfully",
        data: result
    });
});

export const ProviderController = {
    addGear,
    updateGear,
    deleteGear,
    getIncomingOrders,
    updateOrderStatus,
    getDashboardStats
};