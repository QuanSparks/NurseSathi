const { sql } = require('../config/db');

const checkDuplicate = async (jobId, studentId) => {
  const result = await sql`
    SELECT id FROM applications WHERE job_id = ${jobId} AND student_id = ${studentId} LIMIT 1
  `;
  return result[0] || null;
};

const applyToJob = async ({ jobId, studentId, coverLetter }) => {
  const result = await sql`
    INSERT INTO applications (job_id, student_id, cover_letter)
    VALUES (${jobId}, ${studentId}, ${coverLetter || null})
    RETURNING *
  `;
  return result[0];
};

const getApplicationsByJob = async (jobId) => {
  const result = await sql`
    SELECT a.*, 
      u.name AS student_name, u.email AS student_email, u.phone AS student_phone,
      u.education AS student_education, u.skills AS student_skills, u.avatar AS student_avatar
    FROM applications a
    JOIN users u ON a.student_id = u.id
    WHERE a.job_id = ${jobId}
    ORDER BY a.created_at DESC
  `;
  return result;
};

const getApplicationsByHospital = async (hospitalId) => {
  const result = await sql`
    SELECT a.*,
      j.title AS job_title, j.location AS job_location, j.type AS job_type,
      u.name AS student_name, u.email AS student_email, u.phone AS student_phone,
      u.education AS student_education, u.skills AS student_skills, u.avatar AS student_avatar
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.student_id = u.id
    WHERE j.posted_by = ${hospitalId}
    ORDER BY a.created_at DESC
  `;
  return result;
};

const getApplicationsByStudent = async (studentId) => {
  const result = await sql`
    SELECT a.*,
      j.title AS job_title, j.description AS job_description, 
      j.location AS job_location, j.salary AS job_salary, j.type AS job_type,
      u.name AS hospital_name, u.avatar AS hospital_avatar
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON j.posted_by = u.id
    WHERE a.student_id = ${studentId}
    ORDER BY a.created_at DESC
  `;
  return result;
};

const updateApplicationStatus = async (applicationId, status, hospitalId) => {
  // Ensure hospital can only update applications for their own jobs
  const result = await sql`
    UPDATE applications a
    SET status = ${status}
    FROM jobs j
    WHERE a.id = ${applicationId}
      AND a.job_id = j.id
      AND j.posted_by = ${hospitalId}
    RETURNING a.*
  `;
  return result[0] || null;
};

module.exports = {
  checkDuplicate,
  applyToJob,
  getApplicationsByJob,
  getApplicationsByHospital,
  getApplicationsByStudent,
  updateApplicationStatus,
};
