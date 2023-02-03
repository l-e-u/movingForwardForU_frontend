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
    getUserAuthorization
} from "../controllers/userController.js";

const router = Router();

// get a user's permissions
router.post('/permissions', getUserAuthorization)

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