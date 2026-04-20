const { validationResult } = require('express-validator');
const { createJob, getAllJobs, getJobById, getJobsByHospital, deleteJob } = require('../services/jobService');

const listJobs = async (req, res) => {
  try {
    const { search, type, location } = req.query;
    const jobs = await getAllJobs({ search, type, location });
    res.json({ jobs });
  } catch (err) {
    console.error('List jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await getJobById(parseInt(req.params.id));
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

const postJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, location, salary, type, requirements } = req.body;

  try {
    const job = await createJob({
      title,
      description,
      location,
      salary,
      type,
      requirements,
      posted_by: req.user.id,
    });
    res.status(201).json({ job });
  } catch (err) {
    console.error('Post job error:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await getJobsByHospital(req.user.id);
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your jobs' });
  }
};

const removeJob = async (req, res) => {
  try {
    const deleted = await deleteJob(parseInt(req.params.id), req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

module.exports = { listJobs, getJob, postJob, getMyJobs, removeJob };
