import { Router } from "express";
import { requireAuth } from '../middleware/requireAuth.js';

// controller functions
import {
    loginUser,
    verifyUserEmailAndSetPassword,
    registerUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
} from "../controllers/userController.js";

const router = Router();

// login route
router.post('/login', loginUser);

// verify route
router.post('/verify/:token', verifyUserEmailAndSetPassword);

// authenticates user is valid and logged in to access further end points
// router.use(requireAuth);

// GET all users
router.get('/', getUsers);

// GET a user
router.get('/:id', getUser);

// POST a new user
router.post('/', registerUser);

// DELETE a user
router.delete('/:id', deleteUser);

// UPDATE a user
router.patch('/:id', updateUser)

export default router;