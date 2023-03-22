import { Router } from "express";
import { requireAuth } from '../middleware/requireAuth.js';

// controller functions
import {
    loginUser,
    verifyUser,
    registerUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    verifyEmailToken
} from "../controllers/userController.js";

const router = Router();

// login route
router.post('/login', loginUser);

// verify email token route
router.post('/verify/:emailToken', verifyEmailToken);

// verify route
router.patch('/verify', verifyUser);

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

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