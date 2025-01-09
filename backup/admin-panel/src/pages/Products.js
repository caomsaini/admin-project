import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig"; // Centralized Axios instance.

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/products");
        setProducts(data); // Assuming the API returns an array of products.
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>
            <p>Description: {product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
