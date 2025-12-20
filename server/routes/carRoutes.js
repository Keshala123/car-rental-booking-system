/**
 * Car Routes
 * API endpoints for car operations
 */

import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController.js';

const router = express.Router();

// Public routes
router.get('/', getCars);
router.get('/:id', getCarById);

// Admin routes (in production, add authentication middleware)
router.post('/', createCar);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);

export default router;
