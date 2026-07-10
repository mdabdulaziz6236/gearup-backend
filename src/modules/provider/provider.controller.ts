import { Request, Response, NextFunction } from "express";

import { ProviderService } from "./provider.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

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




export const ProviderController = {
    addGear, updateGear, deleteGear,
};