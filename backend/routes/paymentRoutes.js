const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment order
router.post('/create-order', paymentController.createOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
