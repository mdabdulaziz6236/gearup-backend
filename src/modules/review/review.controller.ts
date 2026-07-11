import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.id;

    const result = await ReviewService.createReview(customerId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: result
    });
});

const getReviewsByGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { gearId } = req.params;

    const result = await ReviewService.getReviewsByGearId(gearId as string);

    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: result
    });
});



export const ReviewController = {
    createReview,
    getReviewsByGear
};