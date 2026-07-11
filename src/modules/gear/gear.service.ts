import { prisma } from "../../lib/prisma";



const getAllGears = async (filters: any, options: any) => {
    const { searchTerm, minPrice, maxPrice, categoryId } = filters;
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const andConditions: any[] = [];


    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
        });
    }


    if (minPrice) andConditions.push({ dailyPrice: { gte: Number(minPrice) } });
    if (maxPrice) andConditions.push({ dailyPrice: { lte: Number(maxPrice) } });
    if (categoryId) andConditions.push({ categoryId });

    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.gearItem.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: { category: true }
    });

    const total = await prisma.gearItem.count({ where: whereConditions });

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total
        },
        data: result
    };
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