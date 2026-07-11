import { GearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const filters = {
        searchTerm: req.query.searchTerm,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        categoryId: req.query.categoryId
    };

    const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };

    const result = await GearService.getAllGears(filters, options);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gears retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await GearService.getGearById(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Gear details retrieved successfully",
        data: result
    });
});

export const GearController = {
    getAllGears,
    getGearById
};