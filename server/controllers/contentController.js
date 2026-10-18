import { query } from '../config/database.js';

export async function getContent(req, res) {
  try {
    const sections = await query('SELECT * FROM wedding_content');

    const content = sections.reduce((acc, row) => {
      acc[row.section_key] = JSON.parse(row.content);
      return acc;
    }, {});

    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getSection(req, res) {
  try {
    const { sectionKey } = req.params;
    const sections = await query('SELECT * FROM wedding_content WHERE section_key = ?', [sectionKey]);

    if (sections.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json(JSON.parse(sections[0].content));
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateSection(req, res) {
  try {
    const { sectionKey } = req.params;
    const content = req.body;

    await query(
      `INSERT INTO wedding_content (section_key, content) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE content = ?`,
      [sectionKey, JSON.stringify(content), JSON.stringify(content)]
    );

    res.json({ success: true, message: 'Content updated' });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function bulkUpdateContent(req, res) {
  try {
    const updates = req.body;

    for (const [sectionKey, content] of Object.entries(updates)) {
      await query(
        `INSERT INTO wedding_content (section_key, content) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE content = ?`,
        [sectionKey, JSON.stringify(content), JSON.stringify(content)]
      );
    }

    res.json({ success: true, message: 'Bulk update completed' });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
