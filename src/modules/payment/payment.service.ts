import config from "../../config";
import { prisma } from "../../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-06-24.dahlia" as any,
});

const createPaymentIntent = async (customerId: string, rentalOrderId: string) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: rentalOrderId },
        include: { gear: true }
    });

    if (order.customerId !== customerId) {
        throw new Error("You are not authorized to pay for this order!");
    }
    if (order.status === "PAID" || order.status === "CANCELLED") {
        throw new Error("Order is already paid or cancelled!");
    }

    const amountInCents = Math.round(Number(order.totalAmount) * 100);


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: order.gear.title,
                        description: `Rental order for ${order.gear.title}`
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            },
        ],
        mode: "payment",

        success_url: `${config.app_url}/payment=successful`,
        cancel_url: `${config.app_url}/payment=cancelled`,
    });


    const payment = await prisma.payment.upsert({
        where: { rentalOrderId },
        update: {
            transactionId: session.id,
            provider: "STRIPE",
        },
        create: {
            rentalOrderId,
            transactionId: session.id,
            amount: order.totalAmount,
            provider: "STRIPE",
            status: "PENDING"
        }
    });

    return {
        paymentUrl: session.url,
        transactionId: session.id,
        paymentId: payment.id
    };
};


const confirmPayment = async (customerId: string, transactionId: string) => {

    const session = await stripe.checkout.sessions.retrieve(transactionId);


    if (session.payment_status !== "paid") {
        throw new Error("Payment is not completed yet!");
    }

    const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
            where: { transactionId },
            data: { status: "COMPLETED", paidAt: new Date() }
        });

        await tx.rentalOrder.update({
            where: { id: payment.rentalOrderId },
            data: { status: "PAID" }
        });

        return payment;
    });

    return result;
};

const getUserPayments = async (customerId: string) => {
    return await prisma.payment.findMany({
        where: { rentalOrder: { customerId } },
        include: { rentalOrder: { include: { gear: true } } },
        orderBy: { createdAt: "desc" }
    });
};

const getPaymentById = async (paymentId: string, customerId: string) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id: paymentId },
        include: { rentalOrder: { include: { gear: true } } }
    });

    if (payment.rentalOrder.customerId !== customerId) {
        throw new Error("You are not authorized to view this payment!");
    }

    return payment;
};

export const PaymentService = {
    createPaymentIntent,
    confirmPayment,
    getUserPayments,
    getPaymentById
};