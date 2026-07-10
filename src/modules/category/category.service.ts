import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
    return await prisma.category.findMany({
        include: {
            gears: {
                where: {
                    isAvailable: true
                },
                select: {
                    id: true,
                    title: true,
                    dailyPrice: true,
                    brand: true,
                    stockQuantity: true
                }
            }
        }
    });
};

export const CategoryService = { getAllCategories };