import React from 'react';

const OrderFilters = ({ selectedFilter, setSelectedFilter }) => {
    const filters = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

    return (
        <div className="order-filters">
            {filters.map(filter => (
                <button
                    key={filter}
                    className={`filter-button ${selectedFilter === filter ? 'active' : ''}`}
                    onClick={() => setSelectedFilter(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default OrderFilters;