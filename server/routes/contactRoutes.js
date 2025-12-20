/**
 * Contact Routes
 * API endpoints for contact form operations
 */

import express from 'express';
import {
  getContacts,
  createContact,
  updateContactStatus,
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getContacts);
router.post('/', createContact);
router.patch('/:id', updateContactStatus);

export default router;
