import express from 'express';
import { ProviderController } from './provider.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';


const router = express.Router();

router.use(auth(UserRole.PROVIDER));

// Gear Management
router.post('/gear', ProviderController.addGear);
router.put('/gear/:id', ProviderController.updateGear);
router.delete('/gear/:id', ProviderController.deleteGear);


export const ProviderRoutes = router;