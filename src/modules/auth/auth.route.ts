import { Router } from "express";
import { authController } from "./auth.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                fullName: string;
                email: string;
                role: UserRole;
            };
        }
    }
}
const router = Router();




router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/me', auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER), authController.getMyProfile)
router.patch('/me', auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER), authController.updateMyProfile);
// update password
router.patch('/change-password', auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER), authController.changePassword);
// logout user
router.post('/logout', authController.logoutUser);




export const authRoutes = router