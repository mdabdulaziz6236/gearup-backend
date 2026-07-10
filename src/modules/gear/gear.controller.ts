import { GearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";



const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await GearService.getAllGears(req.query);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Gears retrieved successfully",
        data: result
    });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await GearService.getGearById(id as string);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Gear details retrieved successfully",
        data: result
    });
});

export const GearController = { getAllGears, getGearById };