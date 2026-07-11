import { prisma } from "../../lib/prisma";

const createReview = async (customerId: string, payload: any) => {
    const { gearId, rating, comment } = payload;


    const previousRental = await prisma.rentalOrder.findFirst({
        where: {
            customerId,
            gearId,
            status: {
                in: ["PAID", "RETURNED", "COMPLETED"]
            }
        }
    });

    if (!previousRental) {
        throw new Error("You can only review gears that you have successfully rented and returned.");
    }


    const review = await prisma.review.create({
        data: {
            customerId,
            gearId,
            rating,
            comment,
            rentalOrderId: previousRental.id
        },
        include: {
            customer: {
                select: { fullName: true, email: true }
            },
            gear: {
                select: { title: true }
            }
        }
    });

    return review;
};

export const ReviewService = { createReview };