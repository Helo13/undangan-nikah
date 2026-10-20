import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';

export async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { category = 'gallery' } = req.body;
    const url = `/uploads/${req.file.filename}`;

    const result = await query(
      'INSERT INTO media_gallery (filename, url, category) VALUES (?, ?, ?)',
      [req.file.filename, url, category]
    );

    res.json({
      success: true,
      id: result.insertId,
      url,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getGallery(req, res) {
  try {
    const { category = 'gallery' } = req.query;
    const media = await query(
      'SELECT * FROM media_gallery WHERE category = ? ORDER BY order_index, uploaded_at DESC',
      [category]
    );

    res.json(media);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteMedia(req, res) {
  try {
    const { id } = req.params;

    const media = await query('SELECT filename FROM media_gallery WHERE id = ?', [id]);

    if (media.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const filePath = path.join(process.cwd(), 'uploads', media[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await query('DELETE FROM media_gallery WHERE id = ?', [id]);

    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function reorderMedia(req, res) {
  try {
    const { items } = req.body; // Array of { id, order_index }

    for (const item of items) {
      await query('UPDATE media_gallery SET order_index = ? WHERE id = ?', [item.order_index, item.id]);
    }

    res.json({ success: true, message: 'Media reordered' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
