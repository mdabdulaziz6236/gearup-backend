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



export const ProviderService = {
    addGear, updateGear, deleteGear
};