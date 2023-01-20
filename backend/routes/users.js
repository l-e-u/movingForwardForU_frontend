import { Router } from 'express';
import { createUser, getUser, getUsers, deleteUser, updateUser } from '../controllers/userController.js'

const router = Router();

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