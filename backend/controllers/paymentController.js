const Razorpay = require('razorpay');
const crypto = require('crypto');
const Fine = require('../models/Fine');

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { fineId } = req.body;

    // Get fine details
    const fine = await Fine.findById(fineId);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    if (fine.status !== 'pending') {
      return res.status(400).json({ message: 'Fine is not pending' });
    }

    // Create order
    const options = {
      amount: fine.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: fineId,
      notes: {
        fineId: fineId
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      fineId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update fine status
    const fine = await Fine.findById(fineId);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    fine.status = 'paid';
    await fine.save();

    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};
