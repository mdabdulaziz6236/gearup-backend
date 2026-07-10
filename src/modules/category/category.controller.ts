import { Request, Response, NextFunction } from "express";

import { CategoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryService.getAllCategories();
sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories fetched successfully",
        data: result
    });
});

export const CategoryController = { getAllCategories };