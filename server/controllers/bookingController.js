/**
 * Booking Controller
 * Request handlers for booking operations
 */

import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

/**
 * Get all bookings
 * GET /api/bookings
 */
export const getBookings = async (req, res) => {
  try {
    const { email, status } = req.query;

    const filter = {};
    if (email) filter.email = email;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('car', 'name brand model image pricePerDay')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

/**
 * Get single booking by ID
 * GET /api/bookings/:id
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message,
    });
  }
};

/**
 * Create new booking
 * POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const { car: carId, pickupDate, returnDate } = req.body;

    // Verify car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    if (!car.available) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking',
      });
    }

    // Calculate total days and price
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const totalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));

    if (totalDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date range. Return date must be after pickup date',
      });
    }

    const totalPrice = totalDays * car.pricePerDay;

    // Create booking
    const booking = await Booking.create({
      ...req.body,
      totalDays,
      totalPrice,
    });

    // Populate car details
    await booking.populate('car', 'name brand model image pricePerDay');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};

/**
 * Update booking status
 * PATCH /api/bookings/:id
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('car');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message,
    });
  }
};

/**
 * Cancel booking
 * DELETE /api/bookings/:id
 */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};
