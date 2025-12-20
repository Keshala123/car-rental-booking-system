/**
 * Booking Page
 * Car rental booking form with validation
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { getCars, createBooking } from '../services/api';
import { formatCurrency, calculateDays } from '../utils/helpers';

// Zod validation schema
const bookingSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  phone: z.string()
    .regex(/^[\d\s\-+()]{10,15}$/, 'Please enter a valid phone number (10-15 digits)'),
  
  carId: z.string().min(1, 'Please select a car'),
  
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Start date cannot be in the past',
    }),
  
  endDate: z.string().min(1, 'End date is required'),
  
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      carId: location.state?.selectedCar?._id || '',
      startDate: '',
      endDate: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  const carId = watch('carId');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    fetchCars();
    if (location.state?.selectedCar) {
      setSelectedCar(location.state.selectedCar);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (carId) {
      const car = cars.find((c) => c._id === carId);
      setSelectedCar(car);
    }
  }, [carId, cars]);

  const fetchCars = async () => {
    try {
      const response = await getCars({ available: true });
      setCars(response.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Transform data to match backend API expectations
      const bookingData = {
        car: data.carId,
        customerName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        pickupDate: data.startDate,
        returnDate: data.endDate,
        additionalNotes: data.notes || '',
      };

      const response = await createBooking(bookingData);
      setBookingDetails(response.data);
      setSuccess(true);
      
      // Reset form after 5 seconds and redirect
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Booking failed:', error);
      const errorMessage = error?.message || error?.error || 'Booking failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total
  const totalDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;
  const totalPrice = selectedCar && totalDays > 0 ? selectedCar.pricePerDay * totalDays : 0;

  if (success && bookingDetails) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for choosing DriveLux. Your booking has been successfully confirmed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
            <h3 className="font-bold text-lg mb-4">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Booking ID:</span> {bookingDetails._id}</p>
              <p><span className="font-semibold">Name:</span> {bookingDetails.customerName}</p>
              <p><span className="font-semibold">Email:</span> {bookingDetails.email}</p>
              <p><span className="font-semibold">Car:</span> {bookingDetails.car?.name || selectedCar?.name}</p>
              <p><span className="font-semibold">Pickup Date:</span> {new Date(bookingDetails.pickupDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Return Date:</span> {new Date(bookingDetails.returnDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Duration:</span> {bookingDetails.totalDays} days</p>
              <p><span className="font-semibold">Total Price:</span> {formatCurrency(bookingDetails.totalPrice)}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Redirecting to home page in 5 seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4">Book Your Ride</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Fill in the details below to complete your reservation
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Information
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Car Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Vehicle *
                  </label>
                  <select
                    {...register('carId')}
                    className={`input-field px-4 ${errors.carId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Choose a car</option>
                    {cars.map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.name} - {formatCurrency(car.pricePerDay)}/day
                      </option>
                    ))}
                  </select>
                  {errors.carId && (
                    <p className="mt-1 text-sm text-red-600">{errors.carId.message}</p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date *
                    </label>
                    <input
                      type="date"
                      {...register('startDate')}
                      min={new Date().toISOString().split('T')[0]}
                      className={`input-field px-4 ${errors.startDate ? 'border-red-500' : ''}`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Date *
                    </label>
                    <input
                      type="date"
                      {...register('endDate')}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className={`input-field px-4 ${errors.endDate ? 'border-red-500' : ''}`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          {...register('firstName')}
                          className={`input-field pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className={`input-field pl-4 ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          {...register('email')}
                          className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          {...register('phone')}
                          className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="011 90 90 450"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows="4"
                    className={`input-field ${errors.notes ? 'border-red-500' : ''}`}
                    placeholder="Any special requests or requirements..."
                  ></textarea>
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Booking Summary
              </h3>

              {selectedCar ? (
                <>
                  <img
                    src={selectedCar.imageUrl}
                    alt={selectedCar.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {selectedCar.name}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-semibold">{selectedCar.category}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Transmission:</span>
                      <span className="font-semibold">{selectedCar.transmission}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Fuel Type:</span>
                      <span className="font-semibold">{selectedCar.fuelType}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Price per day:</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedCar.pricePerDay)}
                      </span>
                    </p>
                  </div>

                  {totalDays > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <p className="flex justify-between text-sm">
                        <span>Rental Duration:</span>
                        <span className="font-semibold">{totalDays} days</span>
                      </p>
                      <p className="flex justify-between text-lg font-bold text-primary-600">
                        <span>Total Price:</span>
                        <span>{formatCurrency(totalPrice)}</span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>Select a car to see details</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
