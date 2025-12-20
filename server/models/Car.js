/**
 * Car Model
 * Mongoose schema for car documents
 */

import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
      maxlength: [100, 'Car name cannot exceed 100 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Economy', 'Compact', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Van'],
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: ['Automatic', 'Manual'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [2, 'Minimum 2 seats required'],
      max: [15, 'Maximum 15 seats allowed'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: [true, 'Car image URL is required'],
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    mileage: {
      type: String,
      default: 'N/A',
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
carSchema.index({ category: 1, available: 1 });
carSchema.index({ pricePerDay: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
