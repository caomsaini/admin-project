import React from 'react';

const Dashboard = () => {
  const stats = [
    { title: 'Order Placed', value: 50 },
    { title: 'Packed', value: 45 },
    { title: 'Ready to Dispatch', value: 40 },
    { title: 'Shipped', value: 30 },
    { title: 'In Transit', value: 25 },
    { title: 'Delivered', value: 20 },
    { title: 'Return Pickup', value: 5 },
    { title: 'Return Received', value: 2 },
  ];

  const metrics = [
    { title: 'Today Orders', value: 45 },
    { title: 'Total Orders', value: 528 },
    { title: 'Delivered Orders', value: 280 },
    { title: 'Returned Orders', value: 12 },
    { title: 'Shipped Orders', value: 150 },
    { title: 'Today Sales', value: '$4,500' },
    { title: 'Total Sales', value: '$200,000' },
    { title: 'Total Customers', value: 320 },
    { title: 'New Customers', value: 45 },
  ];

  return (
    <main className="dashboard">
      <section className="order-status">
        <h2>Order Status</h2>
        <div className="stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="metrics">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h3>{metric.title}</h3>
            <p>{metric.value}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
