const express = require('express');
const razorpay = require('../config/razorpay');
const db = require('../config/db');

const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { userId, scholarshipId, amount } = req.body;

    // Basic validation
    if (!userId || !scholarshipId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId, scholarshipId and amount are required',
      });
    }

    const amountInRupees = Number(amount);

    if (!Number.isInteger(amountInRupees) || amountInRupees < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid integer greater than ₹0',
      });
    }

    // Convert rupees to paise
    const amountInPaise = amountInRupees * 100;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `SCH_${userId}_${Date.now()}`,
    });

    // Store order in database
    const result = await db.query(
      `INSERT INTO sponsorship_payments
        (user_id, scholarship_id, amount, currency, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, scholarship_id, amount, currency,
                 razorpay_order_id, status, created_at`,
      [
        userId,
        scholarshipId,
        amountInPaise,
        'INR',
        razorpayOrder.id,
        'created',
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully',
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      payment: result.rows[0],
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
  console.error('Create Razorpay order error:', error);

  return res.status(500).json({
    success: false,
    message: 'Unable to create payment order',
  });
}
});

module.exports = router;