import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import debateRoutes from './modules/debates/debate.routes.js';
import argumentRoutes from './modules/arguments/argument.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/debates', debateRoutes);
router.use('/arguments', argumentRoutes);
router.use('/ai', aiRoutes);

export default router;