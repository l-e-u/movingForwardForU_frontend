import { Router } from 'express';
import {
    createVehicle,
    getVehicle,
    getVehicles,
    deleteVehicle,
    updateVehicle,
} from '../controllers/vehicleController.js'
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// authenticates user is valid and logged in to access further end points
// router.use(requireAuth);

// GET all vehicles
router.get('/', getVehicles);

// GET a single vehicle
router.get('/:id', getVehicle);

// POST a new vehicle
router.post('/', createVehicle);

// DELETE a vehicle
router.delete('/:id', deleteVehicle);

// UPDATE a vehicle
router.patch('/:id', updateVehicle);

export default router;