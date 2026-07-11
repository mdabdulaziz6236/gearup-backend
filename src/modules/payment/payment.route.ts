import express from 'express';
import { PaymentController } from './payment.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';


const router = express.Router();


router.use(auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER));

router.post('/create', PaymentController.createPayment);
router.post('/confirm', PaymentController.confirmPayment);
router.get('/', PaymentController.getUserPayments);
router.get('/:id', PaymentController.getPaymentById);
export const PaymentRoutes = router;