import express from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middlewares/auth';
import { CustomerController } from './customer.controller';





const router = express.Router();

router.use(auth(UserRole.CUSTOMER));

router.get('/stats', CustomerController.getDashboardStats);

export const CustomerRoutes = router;