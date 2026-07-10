import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../../jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { fullName, email, password, role } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email }
    });

    if (isUserExists) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            fullName,
            email,
            passwordHash: hashedPassword,
            role
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return createdUser;
}

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;


    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }

    if (user.status === 'SUSPENDED') {
        throw new Error("Your account has been suspended. Please contact support for more information.");
    }

    const jwtPayload = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    };
};

const getMyProfileFromDB = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const authService = {
    loginUser,
    registerUserIntoDB,
    getMyProfileFromDB
}