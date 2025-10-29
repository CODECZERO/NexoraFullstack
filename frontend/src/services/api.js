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
    // Ensure productId is a string for consistent comparison
    const idToRemove = String(productId);
    console.log(`Sending DELETE request to /cart/${idToRemove}`);
    
    const response = await api.delete(`/cart/${encodeURIComponent(idToRemove)}`);
    console.log('Remove from cart response:', response);
    
    // Ensure we have a valid response
    if (!response) {
      throw new Error('No response received from server');
    }
    
    // Handle different response formats
    const responseData = response.data || response;
    
    // Normalize the items array and ensure productId is a string
    const normalizedItems = Array.isArray(responseData.items) 
      ? responseData.items.map(item => ({
          ...item,
          productId: String(item.productId)
        }))
      : [];
    
    // Calculate total if not provided
    const calculatedTotal = Number(responseData.total) || 
      normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Return a consistent response format
    const result = {
      items: normalizedItems,
      total: calculatedTotal,
      ...responseData
    };
    
    console.log('Parsed remove from cart result:', result);
    return result;
    
  } catch (error) {
    console.error('Error in removeFromCart:', {
      error,
      response: error.response,
      message: error.message,
      config: error.config,
      requestData: {
        productId,
        type: typeof productId
      }
    });
    
    // Provide more detailed error information
    const errorMessage = error.response?.data?.message || error.message || 'Failed to remove item from cart';
    const errorResponse = new Error(errorMessage);
    
    // Attach additional error details
    errorResponse.status = error.response?.status;
    errorResponse.response = error.response;
    
    throw errorResponse;
  }
};

export const clearCart = async () => {
  try {
    console.log('Sending request to clear cart');
    const response = await api.delete('/cart');
    console.log('Clear cart response:', response);
    
    // Return a consistent response format
    const responseData = response.data || response || {};
    
    return {
      items: Array.isArray(responseData.items) ? responseData.items : [],
      total: Number(responseData.total) || 0,
      message: responseData.message || 'Cart cleared successfully',
      ...responseData
    };
    
  } catch (error) {
    console.error('Error in clearCart:', {
      error,
      response: error.response,
      message: error.message,
      config: error.config
    });
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart';
    const errorResponse = new Error(errorMessage);
    errorResponse.status = error.response?.status;
    errorResponse.response = error.response;
    
    throw errorResponse;
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
