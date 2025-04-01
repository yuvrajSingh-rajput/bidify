import express from 'express';
import { createPlayer, getPlayers, getPlayer, updatePlayer, deletePlayer } from '../controllers/playerController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, adminOnly, createPlayer);
router.get('/', auth, getPlayers);
router.get('/:id', auth, getPlayer);
router.patch('/:id', auth, adminOnly, updatePlayer);
router.delete('/:id', auth, adminOnly, deletePlayer);

export default router;
