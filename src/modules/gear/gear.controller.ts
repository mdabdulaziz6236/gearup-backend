import { GearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";



const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await GearService.getAllGears(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Gears fetched successfully",
        data: result
    });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await GearService.getGearById(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Gear details retrieved successfully",
        data: result
    });
});

export const GearController = { getAllGears, getGearById };