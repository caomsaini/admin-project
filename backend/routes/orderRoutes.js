const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, filterOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/filter', filterOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;