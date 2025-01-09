import React, { createContext, useState, useContext } from "react";

// Create a context for managing loading state
const LoadingContext = createContext();

// Custom hook to access the LoadingContext
export const useLoading = () => useContext(LoadingContext);

// Provider component to wrap around the app
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // State to track loading

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};