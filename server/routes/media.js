import express from 'express.js';
import {
  uploadMedia,
  getGallery,
  deleteMedia,
  reorderMedia,
} from '../controllers/mediaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/gallery', getGallery);
router.post('/upload', authenticateToken, upload.single('image'), uploadMedia);
router.delete('/:id', authenticateToken, deleteMedia);
router.put('/reorder', authenticateToken, reorderMedia);

export default router;