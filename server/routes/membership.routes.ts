import { Router } from 'express';
import { getMembershipStatus, activateMembership } from '../controllers/membership.controller';
import { authRequired } from '../middleware/auth.middleware';

const router = Router();

router.get('/status', authRequired, getMembershipStatus);
router.post('/activate', authRequired, activateMembership);

export default router;
