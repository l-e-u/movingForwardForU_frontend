import { Router } from 'express';
import {
    createStop,
    getStop,
    getStops,
    deleteStop,
    updateStop,
} from '../controllers/stopController.js'
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// authenticates user is valid and logged in to access further end points
// router.use(requireAuth);

// GET all stops
router.get('/', getStops);

// GET a single stop
router.get('/:id', getStop);

// POST a new stop
router.post('/', createStop);

// DELETE a stop
router.delete('/:id', deleteStop);

// UPDATE a stop
router.patch('/:id', updateStop);

export default router;