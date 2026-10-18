import { query } from '../config/database.js';

export async function submitRSVP(req, res) {
  try {
    const { guest_name, email, phone, attendance, guests_count, message } = req.body;

    if (!guest_name || !attendance) {
      return res.status(400).json({ error: 'Guest name and attendance are required' });
    }

    const result = await query(
      `INSERT INTO rsvp_responses (guest_name, email, phone, attendance, guests_count, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [guest_name, email || null, phone || null, attendance, guests_count || 1, message || null]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Submit RSVP error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getRSVPs(req, res) {
  try {
    const rsvps = await query('SELECT * FROM rsvp_responses ORDER BY created_at DESC');

    // Calculate statistics
    const stats = {
      total: rsvps.length,
      attending: rsvps.filter(r => r.attendance === 'attending').length,
      not_attending: rsvps.filter(r => r.attendance === 'not_attending').length,
      maybe: rsvps.filter(r => r.attendance === 'maybe').length,
      total_guests: rsvps.reduce((sum, r) => sum + (r.guests_count || 1), 0),
    };

    res.json({ rsvps, stats });
  } catch (error) {
    console.error('Get RSVPs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function exportRSVPs(req, res) {
  try {
    const rsvps = await query('SELECT * FROM rsvp_responses ORDER BY created_at DESC');

    const csv = [
      ['Name', 'Email', 'Phone', 'Attendance', 'Guests', 'Message', 'Date'].join(','),
      ...rsvps.map(row => [
        `"${row.guest_name}"`,
        row.email || '',
        row.phone || '',
        row.attendance,
        row.guests_count || 1,
        `"${row.message || ''}"`,
        row.created_at
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=rsvp_export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export RSVPs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteRSVP(req, res) {
  try {
    await query('DELETE FROM rsvp_responses WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'RSVP deleted' });
  } catch (error) {
    console.error('Delete RSVP error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function submitWish(req, res) {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const result = await query(
      'INSERT INTO wishes (name, message) VALUES (?, ?)',
      [name, message]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Submit wish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getWishes(req, res) {
  try {
    const wishes = await query(
      'SELECT * FROM wishes WHERE is_approved = true ORDER BY created_at DESC LIMIT 100'
    );
    res.json(wishes);
  } catch (error) {
    console.error('Get wishes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function approveWish(req, res) {
  try {
    await query('UPDATE wishes SET is_approved = true WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Wish approved' });
  } catch (error) {
    console.error('Approve wish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteWish(req, res) {
  try {
    await query('DELETE FROM wishes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Wish deleted' });
  } catch (error) {
    console.error('Delete wish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
