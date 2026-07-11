import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";



const addGear = async (providerId: string, payload: any) => {

    const { categoryName, ...gearData } = payload;

    return await prisma.gearItem.create({
        data: {
            title: gearData.title,
            description: gearData.description,
            brand: gearData.brand,
            dailyPrice: Number(gearData.dailyPrice),
            stockQuantity: Number(gearData.stockQuantity) || 1,
            provider: {
                connect: { id: providerId }
            },

            category: {
                connectOrCreate: {
                    where: { name: categoryName },
                    create: { name: categoryName }
                }
            }
        },
        include: { category: true }
    });
};

const updateGear = async (gearId: string, providerId: string, payload: any) => {

    const gear = await prisma.gearItem.findUniqueOrThrow({ where: { id: gearId } });
    if (gear.providerId !== providerId) {
        throw new Error("You are not authorized to update this gear!");
    }

    return await prisma.gearItem.update({
        where: { id: gearId },
        data: payload
    });
};

const deleteGear = async (gearId: string, providerId: string) => {

    const gear = await prisma.gearItem.findUniqueOrThrow({ where: { id: gearId } });
    if (gear.providerId !== providerId) {
        throw new Error("You are not authorized to delete this gear!");
    }

    return await prisma.gearItem.delete({
        where: { id: gearId }
    });
};

const getIncomingOrders = async (providerId: string) => {

    return await prisma.rentalOrder.findMany({
        where: {
            gear: {
                providerId: providerId
            }
        },
        include: {
            gear: true,
            customer: {
                select: { id: true, fullName: true, email: true }
            },
            payment: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const updateOrderStatus = async (orderId: string, providerId: string, status: OrderStatus) => {

    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: { gear: true }
    });

    if (order.gear.providerId !== providerId) {
        throw new Error("You are not authorized to update this order's status!");
    }

    return await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status }
    });
};

const getProviderStats = async (providerId: string) => {

    const totalGears = await prisma.gearItem.count({
        where: { providerId }
    });


    const totalOrders = await prisma.rentalOrder.count({
        where: {
            gear: { providerId }
        }
    });


    const totalPaidOrders = await prisma.rentalOrder.count({
        where: {
            gear: { providerId },
            status: {
                in: ['PAID', 'PICKED_UP', 'RETURNED', 'COMPLETED']
            }
        }
    });

    const revenue = await prisma.payment.aggregate({
        where: { 
            status: 'COMPLETED',
            rentalOrder: {
                gear: { providerId }
            }
        },
        _sum: { amount: true }
    });


    const recentPaidOrders = await prisma.rentalOrder.findMany({
        where: {
            gear: { providerId },
            status: {
                in: ['PAID', 'PICKED_UP', 'RETURNED', 'COMPLETED']
            }
        },
        include: {
            gear: { select: { title: true, dailyPrice: true } },
            customer: { select: { fullName: true, email: true } },
            payment: { select: { amount: true, transactionId: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return {
        totalGears,
        totalOrders,
        totalPaidOrders,
        totalRevenue: revenue._sum.amount || 0,
        recentPaidOrders
    };
};

export const ProviderService = {
    addGear,
    updateGear,
    deleteGear,
    getIncomingOrders,
    updateOrderStatus,
    getProviderStats
}