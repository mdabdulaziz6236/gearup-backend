import { prisma } from "../../lib/prisma";


const getDashboardStats = async (customerId: string) => {

    const totalRentals = await prisma.rentalOrder.count({
        where: { customerId }
    });

    const activeRentals = await prisma.rentalOrder.count({
        where: {
            customerId,
            status: { in: ['PLACED', 'CONFIRMED', 'PAID', 'PICKED_UP'] }
        }
    });


    const totalSpentResult = await prisma.payment.aggregate({
        where: {
            rentalOrder: { customerId },
            status: 'COMPLETED'
        },
        _sum: { amount: true }
    });

    const totalSpent = totalSpentResult._sum.amount ? Number(totalSpentResult._sum.amount).toFixed(2) : "0.00";


    const recentRentals = await prisma.rentalOrder.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            gear: {
                select: { title: true, brand: true }
            },
            payment: {
                select: { status: true, amount: true }
            }
        }
    });

    return {
        totalRentals,
        activeRentals,
        totalSpent,
        recentRentals
    };
};

export const CustomerService = {
    getDashboardStats
};