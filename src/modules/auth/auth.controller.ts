import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body
    const user = await authService.registerUserIntoDB(payload)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully.",
        data: user,

    })

})

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(payload);


    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: { accessToken, refreshToken }
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const userProfile = await authService.getMyProfileFromDB(user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: userProfile
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = req.body;

    const updatedProfile = await authService.updateMyProfileInDB(user?.id as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully",
        data: updatedProfile
    });
});

export const authController = {
    loginUser,
    registerUser,
    getMyProfile,
    updateMyProfile
}

