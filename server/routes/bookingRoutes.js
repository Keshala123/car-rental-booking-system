/**
 * Booking Routes
 * API endpoints for booking operations
 */

import express from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id', updateBookingStatus);
router.delete('/:id', cancelBooking);

export default router;
