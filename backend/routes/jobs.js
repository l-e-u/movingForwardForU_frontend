import { Router } from 'express';
import {
    createJob,
    getJob,
    getJobs,
    deleteJob,
    updateJob,
    getJobsByUserId
} from '../controllers/jobController.js'
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// authenticates user is valid and logged in to access further end points
// router.use(requireAuth);

// GET all jobs
router.get('/', getJobs);

// GET all jobs assigned to current logged user
router.get('/user', getJobsByUserId);

// GET a single job
router.get('/:id', getJob);

// POST a new job
router.post('/', createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// UPDATE a job
router.patch('/:id', updateJob);

export default router;