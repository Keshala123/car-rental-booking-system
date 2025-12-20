/**
 * Car Controller
 * Request handlers for car-related operations
 */

import Car from '../models/Car.js';

/**
 * Get all cars with optional filters
 * GET /api/cars
 */
export const getCars = async (req, res) => {
  try {
    const { category, transmission, available, minPrice, maxPrice, sort } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (transmission) filter.transmission = transmission;
    if (available !== undefined) filter.available = available === 'true';
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortOption = {};
    if (sort === 'price-asc') sortOption.pricePerDay = 1;
    else if (sort === 'price-desc') sortOption.pricePerDay = -1;
    else if (sort === 'name') sortOption.name = 1;
    else sortOption.createdAt = -1;

    const cars = await Car.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cars',
      error: error.message,
    });
  }
};

/**
 * Get single car by ID
 * GET /api/cars/:id
 */
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car',
      error: error.message,
    });
  }
};

/**
 * Create new car (Admin)
 * POST /api/cars
 */
export const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create car',
      error: error.message,
    });
  }
};

/**
 * Update car (Admin)
 * PUT /api/cars/:id
 */
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: car,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update car',
      error: error.message,
    });
  }
};

/**
 * Delete car (Admin)
 * DELETE /api/cars/:id
 */
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete car',
      error: error.message,
    });
  }
};
