import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

// Cart API
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch cart' };
  }
};

export const addToCart = async (productId, qty = 1) => {
  try {
    const response = await api.post('/cart', { productId, qty });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add item to cart' };
  }
};

export const updateCartItem = async (productId, qty) => {
  try {
    const response = await api.put(`/cart/${productId}`, { qty });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update cart item' };
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    // Ensure we return a consistent response format
    return {
      items: response.data?.items || [],
      total: response.data?.total || 0,
      ...response.data
    };
  } catch (error) {
    // Provide more detailed error information
    const errorResponse = error.response?.data || { message: 'Failed to remove item from cart' };
    errorResponse.status = error.response?.status;
    throw errorResponse;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to clear cart' };
  }
};

// Checkout API
export const checkout = async (customerName, customerEmail, cartItems) => {
  try {
    const response = await api.post('/checkout', {
      customerName,
      customerEmail,
      cartItems,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to process checkout' };
  }
};

export default api;
