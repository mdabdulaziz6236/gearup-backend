import { Router } from "express";
import { authController } from "./auth.controller";
import { UserRole } from "../../../generated/prisma/enums";
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
// router.get('/me', authController.getMyProfile)



export const authRoutes = router