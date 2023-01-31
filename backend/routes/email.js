import { Router } from 'express';
import { createEmail, getEmail, getEmails, deleteEmail, updateEmail } from '../controllers/emailController.js'

const router = Router()

// GET all emails
router.get('/', getEmails);

// GET a single email
router.get('/:id', getEmail);

// POST a new email
router.post('/', createEmail);

// DELETE a email
router.delete('/', deleteEmail);

// UPDATE a email
router.patch('/', updateEmail);

export default router;