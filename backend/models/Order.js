const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        default: function () {
          return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        },
        unique: true,
      },
    date: {
        type: Date,
        default: Date.now,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Ready to Dispatch', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
