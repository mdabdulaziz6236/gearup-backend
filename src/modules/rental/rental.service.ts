import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createRentalOrder = async (customerId: string, payload: any) => {

    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: payload.gearId }
    });

    if (!gear.isAvailable || gear.stockQuantity < 1) {
        throw new Error("This gear is currently out of stock or unavailable.");
    }

    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const totalDays = diffDays === 0 ? 1 : diffDays; 
    

    const totalAmount = totalDays * gear.dailyPrice;


    const rentalOrder = await prisma.rentalOrder.create({
        data: {
            customerId,
            gearId: payload.gearId,
            startDate,
            endDate,
            totalAmount,
            status: "PLACED"
        },
        include: {
            gear: true
        }
    });

    return rentalOrder;
};

const getCustomerOrders = async (customerId: string) => {
    return await prisma.rentalOrder.findMany({
        where: { customerId },
        include: {
            gear: {
                select: { id: true, title: true, brand: true, dailyPrice: true }
            },
            payment: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getRentalOrderById = async (orderId: string, customerId: string) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: { 
            gear: true, 
            payment: true 
        }
    });


    if (order.customerId !== customerId) {
        throw new Error("You are not authorized to view this order!");
    }

    return order;
};


const updateOrderStatus = async (orderId: string, status: OrderStatus) => {

    const existingOrder = await prisma.rentalOrder.findUnique({
        where: { id: orderId }
    });

    if (!existingOrder) {
        throw new Error("Rental order not found!");
    }

    const updatedOrder = await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status }
    });

    return updatedOrder;
};

export const RentalService = { 
    createRentalOrder, 
    getCustomerOrders, 
    getRentalOrderById ,
    updateOrderStatus
};