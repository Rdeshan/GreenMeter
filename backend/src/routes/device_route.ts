import { Router } from 'express';
import { saveDevice } from '../controllers/device_controller';

const router = Router();

router.post('/devices', saveDevice);

export default router;