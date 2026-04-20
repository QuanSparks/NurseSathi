const express = require('express');
const { body } = require('express-validator');
const { authenticate, requireRole } = require('../middleware/auth');
const { listJobs, getJob, postJob, getMyJobs, removeJob } = require('../controllers/jobController');
const { getJobApplications, apply } = require('../controllers/applicationController');

const router = express.Router();

// GET /jobs — public
router.get('/', listJobs);

// GET /jobs/mine — hospital sees their own posted jobs
router.get('/mine', authenticate, requireRole('hospital'), getMyJobs);

// GET /jobs/:id — public
router.get('/:id', getJob);

// POST /jobs — hospital only
router.post(
  '/',
  authenticate,
  requireRole('hospital'),
  [
    body('title').notEmpty().withMessage('Job title is required'),
    body('description').notEmpty().withMessage('Job description is required'),
  ],
  postJob
);

// POST /jobs/:id/apply — student only
router.post('/:id/apply', authenticate, requireRole('student'), apply);

// DELETE /jobs/:id — hospital only (own jobs)
router.delete('/:id', authenticate, requireRole('hospital'), removeJob);

// GET /jobs/:id/applications — hospital only
router.get('/:id/applications', authenticate, requireRole('hospital'), getJobApplications);

module.exports = router;
