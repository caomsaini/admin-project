import React, { useEffect, useState } from 'react';
import '../../styles/OrderDetails.css';

const OrderDetails = ({ orderId }) => {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetch(`/api/orders/${orderId}`)
            .then(response => response.json())
            .then(data => setOrder(data));
    }, [orderId]);

    if (!order) return <p>Loading...</p>;

    return (
        <div className="order-details">
            <h2>Order #{order.id}</h2>
            <p>Customer: {order.customer}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Status: {order.status}</p>

            <h3>Products in Order</h3>
            <ul>
                {order.products.map(product => (
                    <li key={product.id}>
                        {product.name} x {product.quantity} = ₹{product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetails;
