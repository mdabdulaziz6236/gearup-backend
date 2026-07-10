import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true
        }
    });
};

const getAllGear = async () => {
    return await prisma.gearItem.findMany({
        include: {
            provider: { select: { id: true, fullName: true, email: true } },
            category: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getAllRentals = async () => {
    return await prisma.rentalOrder.findMany({
        include: {
            customer: { select: { id: true, fullName: true, email: true } },
            gear: { select: { id: true, title: true, dailyPrice: true } },
            payment: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const AdminService = {
    getAllUsers,
    updateUserStatus,
    getAllGear,
    getAllRentals
};