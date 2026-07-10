import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { RegisterUserPayload } from "./auth.interface";
import config from "../../config";

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



export const authService = {
    // loginUser,
    registerUserIntoDB
}