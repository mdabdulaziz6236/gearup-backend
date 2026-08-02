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
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
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
      status: true,
    },
  });
};

const getAllGear = async () => {
  return await prisma.gearItem.findMany({
    include: {
      provider: { select: { id: true, fullName: true, email: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllRentals = async () => {
  return await prisma.rentalOrder.findMany({
    include: {
      customer: { select: { id: true, fullName: true, email: true } },
      gear: { select: { id: true, title: true, dailyPrice: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getSystemStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalGears = await prisma.gearItem.count();
  const totalOrders = await prisma.rentalOrder.count();

  const revenue = await prisma.payment.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true },
  });

  return {
    totalUsers,
    totalGears,
    totalOrders,
    totalRevenue: revenue._sum.amount || 0,
  };
};

const deleteUser = async (userId: string) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};

const getGearById = async (id: string) => {
  const result = await prisma.gearItem.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, fullName: true, email: true } },
    },
  });

  return result;
};

const deleteGearById = async (id: string) => {
  const result = await prisma.gearItem.delete({
    where: { id },
  });

  return result;
};

const getPayments = async () => {
  return await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
  getSystemStats,
  deleteUser,
  getGearById,
  deleteGearById,
  getPayments,
};
