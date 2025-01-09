    const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date, // Changed from ObjectId to Date
        default: Date.now,
        },
    customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'RTD', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
