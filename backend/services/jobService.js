const { sql } = require('../config/db');

const createJob = async ({ title, description, location, salary, type, requirements, posted_by }) => {
  const result = await sql`
    INSERT INTO jobs (title, description, location, salary, type, requirements, posted_by)
    VALUES (${title}, ${description}, ${location || null}, ${salary || null}, ${type || null}, ${requirements || null}, ${posted_by})
    RETURNING *
  `;
  return result[0];
};

const getAllJobs = async ({ search, type, location } = {}) => {
  let result;

  if (search || type || location) {
    result = await sql`
      SELECT j.*, u.name AS hospital_name, u.location AS hospital_location, u.avatar AS hospital_avatar
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
      WHERE
        (${search || null} IS NULL OR j.title ILIKE ${'%' + (search || '') + '%'} OR j.description ILIKE ${'%' + (search || '') + '%'})
        AND (${type || null} IS NULL OR j.type = ${type})
        AND (${location || null} IS NULL OR j.location ILIKE ${'%' + (location || '') + '%'})
      ORDER BY j.created_at DESC
    `;
  } else {
    result = await sql`
      SELECT j.*, u.name AS hospital_name, u.location AS hospital_location, u.avatar AS hospital_avatar
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
      ORDER BY j.created_at DESC
    `;
  }

  return result;
};

const getJobById = async (id) => {
  const result = await sql`
    SELECT j.*, u.name AS hospital_name, u.location AS hospital_location, u.email AS hospital_email, u.phone AS hospital_phone
    FROM jobs j
    LEFT JOIN users u ON j.posted_by = u.id
    WHERE j.id = ${id}
    LIMIT 1
  `;
  return result[0] || null;
};

const getJobsByHospital = async (hospitalId) => {
  const result = await sql`
    SELECT j.*, 
      COUNT(a.id)::int AS application_count
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.posted_by = ${hospitalId}
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `;
  return result;
};

const deleteJob = async (id, postedBy) => {
  const result = await sql`
    DELETE FROM jobs WHERE id = ${id} AND posted_by = ${postedBy}
    RETURNING id
  `;
  return result[0] || null;
};

module.exports = { createJob, getAllJobs, getJobById, getJobsByHospital, deleteJob };
