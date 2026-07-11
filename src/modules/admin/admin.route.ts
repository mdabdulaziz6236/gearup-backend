import express from 'express';
import { AdminController } from './admin.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';



const router = express.Router();

router.use(auth(UserRole.ADMIN));

router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id', AdminController.updateUserStatus);
router.get('/gear', AdminController.getAllGear);
router.get('/rentals', AdminController.getAllRentals);
router.get('/stats', AdminController.getStats);
export const AdminRoutes = router;