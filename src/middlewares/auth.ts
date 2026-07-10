import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { jwtUtils } from "../../jwt";
import { prisma } from "../lib/prisma";

export const auth = (...requiredRoles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies?.accessToken ?
            req.cookies.accessToken :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization.split(" ")[1] :
                req.headers.authorization;

        if (!token) {
            throw new Error("You are not authenticated! Please login to get access.");
        }

        const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret as string);

        if (!verifyToken.success || !verifyToken.data) {
            throw new Error(verifyToken.message || "Invalid Token");
        }


        const { id, role } = verifyToken.data as JwtPayload;


        if (requiredRoles.length && !requiredRoles.includes(role as UserRole)) {
            throw new Error("Forbidden! You don't have permission to access this resource.");
        }


        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            throw new Error("User not found. Invalid token.");
        }


        if (user.status === 'SUSPENDED') {
            throw new Error("Your account has been suspended. Please contact support.");
        }
        req.user = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        next();
    });
};