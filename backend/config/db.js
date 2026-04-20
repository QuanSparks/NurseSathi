const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

const initDB = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'hospital')),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        phone VARCHAR(20),
        education TEXT,
        skills TEXT,
        hospital_name VARCHAR(255),
        location VARCHAR(255),
        google_id VARCHAR(255),
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255),
        salary VARCHAR(100),
        type VARCHAR(50),
        requirements TEXT,
        posted_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'accepted', 'rejected')),
        cover_letter TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(job_id, student_id)
      )
    `;

    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    throw err;
  }
};

module.exports = { sql, initDB };
