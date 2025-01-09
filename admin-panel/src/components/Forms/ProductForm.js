import React, { useState } from "react";
import axios from "../../utils/axiosConfig";

const ProductForm = () => {
  const [product, setProduct] = useState({ name: "", price: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/products", product);
      alert("Product added successfully!");
      console.log("Product added:", response.data);
      setProduct({ name: "", price: "", description: "" }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        required
      ></textarea>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
