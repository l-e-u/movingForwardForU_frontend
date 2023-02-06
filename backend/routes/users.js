import { Router } from "express";

// controller functions
import {
    loginUser,
    signupUser,
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
} from "../controllers/userController.js";

const router = Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// GET all users
router.get('/', getUsers);

// GET a user
router.get('/:id', getUser);

// POST a new user
router.post('/', createUser);

// DELETE a user
router.delete('/:id', deleteUser);

// UPDATE a user
router.patch('/:id', updateUser)

export default router;