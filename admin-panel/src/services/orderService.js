const API_URL = 'http://localhost:5000/api';

export const getOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};
