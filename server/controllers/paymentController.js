/**
 * Payment Controller
 * Handle Stripe payment processing
 */

import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import logger from '../config/logger.js';

// Lazy initialization of Stripe
let stripe = null;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

/**
 * Create payment intent for booking
 * @route POST /api/payment/create-intent
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      logger.warn('Payment intent creation failed - missing bookingId or amount');
      return res.status(400).json({
        success: false,
        message: 'Booking ID and amount are required',
      });
    }

    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      logger.warn(`Payment intent creation failed - booking not found: ${bookingId}`);
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Create payment intent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId,
        userId: req.user._id.toString(),
        customerEmail: booking.email,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logger.info(`Payment intent created: ${paymentIntent.id} for booking: ${bookingId}`);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

/**
 * Confirm payment and update booking
 * @route POST /api/payment/confirm
 */
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID and booking ID are required',
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      logger.warn(`Payment confirmation failed - status: ${paymentIntent.status}`);
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed',
        status: paymentIntent.status,
      });
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentIntentId: paymentIntentId,
      },
      { new: true }
    ).populate('car');

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      paymentIntentId: paymentIntentId,
      status: 'completed',
      paymentMethod: paymentIntent.payment_method,
    });

    logger.info(`Payment confirmed: ${paymentIntentId} for booking: ${bookingId}`);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      booking,
      payment,
    });
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message,
    });
  }
};

/**
 * Get payment details
 * @route GET /api/payment/:paymentId
 */
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('booking')
      .populate('user', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check if user owns this payment or is admin
    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this payment',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment',
      error: error.message,
    });
  }
};

/**
 * Get user's payment history
 * @route GET /api/payment/user/history
 */
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    logger.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message,
    });
  }
};

/**
 * Webhook handler for Stripe events
 * @route POST /api/payment/webhook
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      logger.info(`PaymentIntent succeeded: ${paymentIntent.id}`);
      // Update booking status automatically
      if (paymentIntent.metadata.bookingId) {
        await Booking.findByIdAndUpdate(paymentIntent.metadata.bookingId, {
          status: 'Confirmed',
          paymentStatus: 'Paid',
        });
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      logger.warn(`PaymentIntent failed: ${failedPayment.id}`);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
