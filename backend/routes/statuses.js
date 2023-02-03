import { Router } from 'express';
import { createStatus, getStatus, getStatuses, deleteStatus, updateStatus } from '../controllers/statusController.js'

const router = Router();

// GET all jobs
router.get('/', getStatuses);

// GET a single job
router.get('/:id', getStatus);

// POST a new job
router.post('/', createStatus);

// DELETE a job
router.delete('/:id', deleteStatus);

// UPDATE a job
router.patch('/:id', updateStatus);

export default router;