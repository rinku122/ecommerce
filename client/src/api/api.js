import axios from "axios";

const API_BASE_URL = "https://ecommerce-backend-bonh.onrender.com"; // Adjust this according to your backend URL

// Users: Get Items
export const getItems = () => {
  return axios.get(`${API_BASE_URL}/cart`);
};

// Add item to cart
export const confirmOrder = async (data) => {
  return await axios.post(`${API_BASE_URL}/cart`, data);
};

// Checkout
export const applyDiscount = (data) => {
  return axios.post(`${API_BASE_URL}/cart/checkout`, data);
};

// Admin: Generate discount code
export const generateDiscountCode = (orderNumber) => {
  return axios.post(`${API_BASE_URL}/admin/discount`, { orderNumber });
};

// Admin: Get purchases and discount info
export const getAllPurchases = () => {
  return axios.get(`${API_BASE_URL}/admin/purchases`);
};
