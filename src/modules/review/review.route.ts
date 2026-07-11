import express from 'express';
import { ReviewController } from './review.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';

const router = express.Router();

router.post('/', auth(UserRole.CUSTOMER), ReviewController.createReview);
router.get('/:gearId', ReviewController.getReviewsByGear);



export const ReviewRoutes = router;