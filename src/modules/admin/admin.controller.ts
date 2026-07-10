import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminService } from "./admin.service";
import { UserStatus } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllUsers();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const result = await AdminService.updateUserStatus(req.params.id as string, status as UserStatus);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: result
    });
});

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllGear();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All gears retrieved successfully",
        data: result
    });
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllRentals();
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "All rental orders retrieved successfully",
        data: result
    });
});

export const AdminController = {
    getAllUsers,
    updateUserStatus,
    getAllGear,
    getAllRentals
};