import express from 'express';
import {
  getContent,
  getSection,
  updateSection,
  bulkUpdateContent,
} from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getContent);
router.get('/:sectionKey', getSection);
router.put('/:sectionKey', authenticateToken, updateSection);
router.put('/bulk', authenticateToken, bulkUpdateContent);

export default router;
