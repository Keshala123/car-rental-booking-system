/**
 * Payment Routes
 * API endpoints for payment processing
 */

import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  getUserPayments,
  handleWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create-intent', protect, paymentLimiter, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/user/history', protect, getUserPayments);
router.get('/:paymentId', protect, getPayment);

// Webhook route (no authentication - verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
