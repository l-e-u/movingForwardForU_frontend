import { Router } from 'express';
import { createJob, getJob, getJobs, deleteJob, updateJob } from '../controllers/jobController.js'

const router = Router();

// GET all jobs
router.get('/', getJobs);

// GET a single job
router.get('/:id', getJob);

// POST a new job
router.post('/', createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// UPDATE a job
router.patch('/:id', updateJob);

export default router;