import express from 'express';
import { RentalController } from './rental.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';


const router = express.Router();

router.use(auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER));

router.post('/', RentalController.createRentalOrder);
router.get('/', RentalController.getCustomerOrders);
router.get('/:id', RentalController.getRentalOrderById);

router.patch('/:id/status', auth(UserRole.ADMIN, UserRole.PROVIDER), RentalController.updateStatus);

export const RentalRoutes = router;