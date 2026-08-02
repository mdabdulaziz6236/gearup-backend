import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CustomerService } from "./customer.service";
import httpStatus from "http-status";

const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const result = await CustomerService.getDashboardStats(customerId as string);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer dashboard stats retrieved successfully",
        data: result 
    });
});

export const CustomerController = {
    getDashboardStats
};