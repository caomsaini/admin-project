import React, { useEffect, useState } from 'react';
import OrderFilters from './OrderFilters';
import io from 'socket.io-client';
import "../../styles/OrderList.css";

const socket = io('http://localhost:5000');

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('All');

    useEffect(() => {
        // Fetch existing orders
        const fetchOrders = async () => {
            try {
              const response = await fetch("/api/orders");
              const data = await response.json();
              setOrders(data);
            } catch (error) {
              console.error("Error fetching orders:", error.message);
            }
          };
          fetchOrders();

          socket.on("orderStatusUpdate", (updatedOrder) => {
            setOrders((prevOrders) => {
              const existingIndex = prevOrders.findIndex(
                (order) => order.id === updatedOrder.id
              );
              if (existingIndex !== -1) {
                // Update the existing order
                const updatedOrders = [...prevOrders];
                updatedOrders[existingIndex] = updatedOrder;
                return updatedOrders;
              } else {
                // Add a new order at the top
                return [updatedOrder, ...prevOrders];
              }
            });
          });
      
          return () => {
            socket.off("orderStatusUpdate");
          };
        }, []);

        useEffect(() => {
            // Header Freeze Logic
            const tableContainer = document.querySelector(".orders-table-container");
            const tableHeader = document.querySelector(".orders-table thead");
        
            const handleScroll = () => {
              const containerTop = tableContainer.getBoundingClientRect().top;
              const headerTop = tableHeader.getBoundingClientRect().top;
        
              if (headerTop < containerTop) {
                tableHeader.style.transform = "translateY(0)"; // Freeze header
                tableHeader.style.position = "sticky";
              } else {
                tableHeader.style.transform = "translateY(-100%)"; // Animate header
                tableHeader.style.position = "relative";
              }
            };
        
            tableContainer.addEventListener("scroll", handleScroll);
            return () => tableContainer.removeEventListener("scroll", handleScroll);
          }, []);
        
          const filteredOrders =
            selectedFilter === "All"
              ? orders
              : orders.filter((order) => order.status === selectedFilter);
        
          return (
            <div className="orders-list-container">
              
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Order Date</th>
                      <th>Customer Name</th>
                      <th>Products</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id || "N/A"}</td>
                        <td>order.orderDate</td>
                        <td>{order.customer?.name || "Unknown"}</td>
                        <td>
                          {order.products.map((product, index) => (
                            <div key={index} className="product-details">
                              <img
                                src={product.productId?.image || "/placeholder.png"}
                                alt={product.productId?.name || "Unknown Product"}
                                className="product-image"
                              />
                              <span>{product.productId?.name || "Unknown"}</span>
                              <span> x{product.quantity}</span>
                            </div>
                          ))}
                        </td>
                        <td>₹ {order.totalPrice.toFixed(2)}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        };
        
        export default OrderList;