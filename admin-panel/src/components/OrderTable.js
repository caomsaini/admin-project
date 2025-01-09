import React from "react";
import "../styles/OrderTable.css";

const OrderTable = ({ orders }) => {
  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.total}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
