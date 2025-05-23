import express from 'express';
import { 
    getAllPlayers, 
    getPlayer, 
    updatePlayer, 
    deletePlayer, 
    createPlayerRequest
} from '../controllers/player.controller.js';
import { auth, adminOnly } from '../middleware/auth.js';
import upload from '../utils/multer.js';

const router = express.Router();

// router.post('/', auth, adminOnly, createPlayer);
router.post('/registration-request', auth, adminOnly, upload.fields([
    {name: "profilePhoto", maxCount: 1},
    {name: "certificates", maxCount: 10},
]) , createPlayerRequest);
router.get('/', auth, getAllPlayers);
router.get('/:id', auth, getPlayer);
router.patch('/:id', auth, adminOnly, updatePlayer);
router.delete('/:id', auth, adminOnly, deletePlayer);

export default router;
