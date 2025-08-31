// import { Router } from 'express';
// import { googleAuth } from '../controllers/auth.controller';

// const router = Router();

// router.post('/google', googleAuth);

// export default router;




import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

// router.post('/google', googleAuth);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
