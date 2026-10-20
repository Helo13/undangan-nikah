import express from 'express';
import {
  submitRSVP,
  getRSVPs,
  exportRSVPs,
  deleteRSVP,
  submitWish,
  getWishes,
  approveWish,
  deleteWish,
} from '../controllers/rsvpController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitRSVP);
router.get('/', authenticateToken, getRSVPs);
router.get('/export', authenticateToken, exportRSVPs);
router.delete('/:id', authenticateToken, deleteRSVP);

router.post('/wishes', submitWish);
router.get('/wishes', getWishes);
router.patch('/wishes/:id/approve', authenticateToken, approveWish);
router.delete('/wishes/:id', authenticateToken, deleteWish);

export default router;
