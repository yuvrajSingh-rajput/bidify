import express from 'express';
import { createAuction, getAuctions, getAuction, startAuction, cancelAuction } from '../controllers/auctionController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, adminOnly, createAuction);
router.get('/', auth, getAuctions);
router.get('/:id', auth, getAuction);
router.post('/:id/start', auth, adminOnly, startAuction);
router.post('/:id/cancel', auth, adminOnly, cancelAuction);

export default router;
