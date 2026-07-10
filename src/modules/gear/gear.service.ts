import { prisma } from "../../lib/prisma";



const getAllGears = async (query: any) => {
    const { category, brand, minPrice, maxPrice } = query;


    const filter: any = { isAvailable: true };

    if (category) filter.categoryId = category;
    if (brand) filter.brand = { contains: brand, mode: 'insensitive' };

    if (minPrice || maxPrice) {
        filter.dailyPrice = {};
        if (minPrice) filter.dailyPrice.gte = Number(minPrice);
        if (maxPrice) filter.dailyPrice.lte = Number(maxPrice);
    }

    const result = await prisma.gearItem.findMany({
        where: filter,
        include: {
            category: { select: { name: true } },
            provider: { select: { fullName: true } }
        }
    });
    return result;
};


const getGearById = async (id: string) => {
    const result = await prisma.gearItem.findUniqueOrThrow({
        where: { id },
        include: {
            category: true,
            provider: { select: { id: true, fullName: true, email: true } }
        }
    });

    return result;
};

export const GearService = { getAllGears, getGearById };