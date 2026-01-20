/**
 * Payment Page
 * Handle Stripe payment for bookings
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import { api } from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking) {
      navigate('/my-bookings');
      return;
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payment/create-intent', {
          bookingId: booking._id,
          amount: booking.totalPrice,
        });

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [booking, navigate]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center text-white hover:text-primary-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Bookings
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Secure Payment</h1>
            <p className="text-xl text-primary-100">
              Complete your booking payment
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card h-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Summary
              </h2>
              
              {booking.car && (
                <div className="mb-6">
                  <img
                    src={booking.car.image}
                    alt={booking.car.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900">
                    {booking.car.name}
                  </h3>
                  <p className="text-gray-600">{booking.car.category}</p>
                </div>
              )}

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Date:</span>
                  <span className="font-medium">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Return Date:</span>
                  <span className="font-medium">
                    {new Date(booking.returnDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days:</span>
                  <span className="font-medium">{booking.totalDays} days</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Total Amount:</span>
                <span className="font-bold text-primary-600 text-2xl">
                  ${booking.totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="mt-6 flex items-center text-sm text-gray-600">
                <Lock className="w-4 h-4 mr-2" />
                <span>Secured by Stripe</span>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card h-full"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Details
                </h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600">Initializing payment...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              ) : clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  <PaymentForm 
                    bookingId={booking._id}
                    amount={booking.totalPrice}
                  />
                </Elements>
              ) : null}

              <div className="mt-6 text-sm text-gray-500 space-y-2">
                <p>✓ Your payment information is encrypted</p>
                <p>✓ We never store your card details</p>
                <p>✓ Full refund if cancelled within 24 hours</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
