import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wedding_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

export async function getConnection() {
  return await pool.getConnection();
}

export async function query(sql, values) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      )
    `);

    // Create wedding_content table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wedding_content (
        id INT PRIMARY KEY AUTO_INCREMENT,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_section (section_key)
      )
    `);

    // Create media_gallery table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS media_gallery (
        id INT PRIMARY KEY AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        type ENUM('image', 'video') DEFAULT 'image',
        category VARCHAR(50) DEFAULT 'gallery',
        order_index INT DEFAULT 0,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_order (order_index)
      )
    `);

    // Create rsvp_responses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rsvp_responses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        guest_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        attendance ENUM('attending', 'not_attending', 'maybe') NOT NULL,
        guests_count INT DEFAULT 1,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_attendance (attendance),
        INDEX idx_created (created_at)
      )
    `);

    // Create wishes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wishes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_approved (is_approved),
        INDEX idx_created (created_at)
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
