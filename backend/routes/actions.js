import { Router } from 'express';
import { createAction, getAction, getActions, deleteAction, updateAction } from '../controllers/actionController.js'

const router = Router();

// GET all jobs
router.get('/', getActions);

// GET a single job
router.get('/:id', getAction);

// POST a new job
router.post('/', createAction);

// DELETE a job
router.delete('/:id', deleteAction);

// UPDATE a job
router.patch('/:id', updateAction);

export default router;