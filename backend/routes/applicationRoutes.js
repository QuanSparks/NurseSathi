const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  apply,
  getHospitalApplications,
  getMyApplications,
  updateStatus,
} = require('../controllers/applicationController');

const router = express.Router();

// POST /jobs/:id/apply — student only (mounted via app.use, but this router handles /applications)
// This route is handled in jobRoutes for /jobs/:id/apply

// GET /applications — hospital: all applicants across their jobs
router.get('/', authenticate, requireRole('hospital'), getHospitalApplications);

// GET /applications/mine — student: their own applications
router.get('/mine', authenticate, requireRole('student'), getMyApplications);

// PATCH /applications/:id/status — hospital only
router.patch('/:id/status', authenticate, requireRole('hospital'), updateStatus);

module.exports = router;
