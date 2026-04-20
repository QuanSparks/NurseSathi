const { sql } = require('../config/db');

const createUser = async ({ name, email, password, role, phone, google_id, avatar }) => {
  const result = await sql`
    INSERT INTO users (name, email, password, role, phone, google_id, avatar)
    VALUES (${name}, ${email}, ${password}, ${role}, ${phone || null}, ${google_id || null}, ${avatar || null})
    RETURNING id, name, email, role, phone, education, skills, hospital_name, location, avatar, created_at
  `;
  return result[0];
};

const findByEmail = async (email) => {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
  return result[0] || null;
};

const findById = async (id) => {
  const result = await sql`
    SELECT id, name, email, role, phone, education, skills, hospital_name, location, avatar, google_id, created_at
    FROM users WHERE id = ${id} LIMIT 1
  `;
  return result[0] || null;
};

const updateProfile = async (id, updates) => {
  const { name, phone, education, skills, hospital_name, location, avatar, role } = updates;
  const result = await sql`
    UPDATE users
    SET
      name = COALESCE(${name}, name),
      phone = COALESCE(${phone}, phone),
      education = COALESCE(${education}, education),
      skills = COALESCE(${skills}, skills),
      hospital_name = COALESCE(${hospital_name}, hospital_name),
      location = COALESCE(${location}, location),
      avatar = COALESCE(${avatar}, avatar),
      role = COALESCE(${role}, role)
    WHERE id = ${id}
    RETURNING id, name, email, role, phone, education, skills, hospital_name, location, avatar, created_at
  `;
  return result[0];
};

module.exports = { createUser, findByEmail, findById, updateProfile };
