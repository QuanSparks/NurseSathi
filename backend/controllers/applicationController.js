const {
  checkDuplicate,
  applyToJob,
  getApplicationsByJob,
  getApplicationsByHospital,
  getApplicationsByStudent,
  updateApplicationStatus,
} = require('../services/applicationService');

const apply = async (req, res) => {
  const jobId = parseInt(req.params.id);
  const studentId = req.user.id;
  const { coverLetter } = req.body;

  try {
    const duplicate = await checkDuplicate(jobId, studentId);
    if (duplicate) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }

    const application = await applyToJob({ jobId, studentId, coverLetter });
    res.status(201).json({ application });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
};

const getHospitalApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByHospital(req.user.id);
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

const getJobApplications = async (req, res) => {
  const jobId = parseInt(req.params.id);
  try {
    const applications = await getApplicationsByJob(jobId);
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByStudent(req.user.id);
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your applications' });
  }
};

const updateStatus = async (req, res) => {
  const applicationId = parseInt(req.params.id);
  const { status } = req.body;
  const validStatuses = ['applied', 'reviewed', 'accepted', 'rejected'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await updateApplicationStatus(applicationId, status, req.user.id);
    if (!updated) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }
    res.json({ application: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = { apply, getHospitalApplications, getJobApplications, getMyApplications, updateStatus };
