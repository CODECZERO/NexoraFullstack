import React, { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import CheckoutModal, { ReceiptModal } from './components/CheckoutModal';
import ProductSkeleton from './components/ProductSkeleton';
import ErrorBoundary from './components/ErrorBoundary';
import {
  getProducts,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} from './services/api';

// Maximum number of retries for API calls
const MAX_RETRIES = 3;

function App() {
  // State management
  const [state, setState] = useState({
    products: [],
    cartItems: [],
    cartTotal: 0,
    cartCount: 0,
    isCartOpen: false,
    isCheckoutOpen: false,
    isReceiptOpen: false,
    receipt: null,
    loading: true,
    error: null,
    addingProduct: null,
    retryCount: 0,
  });

  // Update state helper function
  const updateState = (updates) => {
    setState(prev => ({
      ...prev,
      ...updates,
      // Ensure cartCount is always in sync with cartItems
      ...(updates.cartItems && { 
        cartCount: updates.cartItems.reduce((sum, item) => sum + item.quantity, 0) 
      })
    }));
  };

  // Memoized fetch functions
  const fetchProducts = useCallback(async (retryCount = 0) => {
    updateState({ loading: true, error: null });
    
    try {
      const response = await getProducts();
      
      // Handle different response formats
      const productsData = Array.isArray(response) 
        ? response 
        : (response?.data || []);
      
      updateState({ 
        products: productsData,
        loading: false,
        retryCount: 0 // Reset retry count on success
      });
      
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMessage = err.message || 'Failed to load products';
      
      if (retryCount < MAX_RETRIES) {
        // Auto-retry with exponential backoff
        const delay = 1000 * Math.pow(2, retryCount);
        setTimeout(() => fetchProducts(retryCount + 1), delay);
        return;
      }
      
      updateState({ 
        error: errorMessage,
        loading: false,
        products: []
      });
      
      toast.error(`Failed to load products: ${errorMessage}`);
    }
  }, []);
  
  const fetchCart = useCallback(async () => {
    try {
      const response = await getCart();
      const cartData = response.data || response;
      
      updateState({
        cartItems: cartData.items || [],
        cartTotal: cartData.total || 0,
        cartCount: cartData.items ? cartData.items.length : 0
      });
      
    } catch (err) {
      console.error('Error fetching cart:', err);
      toast.error('Failed to load cart. Please refresh to try again.');
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchProducts(), fetchCart()]);
      } catch (error) {
        console.error('Error in initial data loading:', error);
      } finally {
        updateState({ loading: false });
      }
    };
    
    loadInitialData();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [fetchProducts, fetchCart]);

  const handleAddToCart = async (product) => {
    try {
      updateState({ addingProduct: product.id });
      const response = await addToCart(product.id, 1);
      const cartData = response.data || response;
      
      updateState({
        cartItems: cartData.items || [],
        cartTotal: cartData.total || 0,
        cartCount: cartData.items ? cartData.items.length : 0
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error(err.message || 'Failed to add item to cart');
    } finally {
      updateState({ addingProduct: null });
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await updateCartItem(productId, newQuantity);
      const cartData = response.data || response;
      
      updateState({
        cartItems: cartData.items || [],
        cartTotal: cartData.total || 0,
        cartCount: cartData.items ? cartData.items.length : 0
      });
      
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    // Ensure productId is a string to match backend expectation
    const productIdStr = String(productId);
    // Store the current cart items for potential rollback
    const previousCartItems = [...state.cartItems];
    
    try {
      console.log('Removing item ID:', productIdStr, 'Type:', typeof productIdStr);
      console.log('Current cart items before removal:', state.cartItems.map(i => ({
        productId: i.productId,
        type: typeof i.productId,
        name: i.name
      })));
      
      // Optimistically update the UI
      const updatedItems = state.cartItems.filter(item => String(item.productId) !== productIdStr);
      updateState({
        cartItems: updatedItems,
        cartCount: updatedItems.length,
        cartTotal: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      });
      
      // Make the API call to remove the item
      console.log('Making API call to remove item ID:', productIdStr);
      const response = await removeFromCart(productIdStr);
      console.log('Remove from cart API response:', response);
      
      // Verify the removal by refetching the cart
      console.log('Fetching updated cart...');
      const cartResponse = await getCart();
      console.log('Updated cart from server:', cartResponse);
      
      // Ensure we have valid cart data
      const cartData = cartResponse.data || cartResponse || {};
      
      // Normalize the cart items
      const normalizedItems = Array.isArray(cartData.items) 
        ? cartData.items.map(item => ({
            ...item,
            productId: String(item.productId) // Ensure productId is a string
          }))
        : [];
      
      updateState({
        cartItems: normalizedItems,
        cartTotal: Number(cartData.total) || 0,
        cartCount: normalizedItems.length
      });
      
      console.log('Cart after successful removal:', {
        items: normalizedItems,
        total: cartData.total,
        count: normalizedItems.length
      });
      
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Failed to remove item:', {
        error: err,
        response: err.response,
        message: err.message,
        stack: err.stack
      });
      
      // Revert to the previous state on error
      updateState({
        cartItems: previousCartItems,
        cartCount: previousCartItems.length,
        cartTotal: previousCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      });
      
      // Show error message
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove item';
      toast.error(errorMessage);
    }
  };

  const handleCheckout = () => {
    if (state.cartItems.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    updateState({ 
      isCartOpen: false,
      isCheckoutOpen: true 
    });
  };

  const handleCheckoutSubmit = async (name, email) => {
    try {
      const response = await checkout(name, email, state.cartItems);
      
      updateState({
        receipt: response.data,
        isCheckoutOpen: false,
        isReceiptOpen: true
      });
      
      // Refresh cart after successful checkout
      await fetchCart();
      
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to process checkout');
    }
  };

  const handleClearCart = async () => {
    if (state.cartItems.length === 0) {
      toast.info('Your cart is already empty');
      return;
    }

    try {
      // Optimistically update the UI
      updateState({
        cartItems: [],
        cartTotal: 0,
        cartCount: 0,
        loading: true
      });

      // Make the API call to clear the cart
      await clearCart();
      
      // Refresh the cart to ensure consistency
      await fetchCart();
      
      toast.success('Cart cleared successfully');
    } catch (err) {
      console.error('Failed to clear cart:', err);
      
      // Revert to the previous state on error
      const { data } = await getCart();
      updateState({
        cartItems: data?.items || [],
        cartTotal: data?.total || 0,
        cartCount: data?.items?.length || 0,
        loading: false
      });
      
      toast.error(err.message || 'Failed to clear cart');
    } finally {
      updateState({ loading: false });
    }
  };

  const handleReceiptClose = () => {
    updateState({
      isReceiptOpen: false,
      receipt: null
    });
  };

  if (state.loading) {
    return (
      <div className="App">
        <header className="header">
          <div className="header-content">
            <h1 className="logo">Vibe Commerce</h1>
            <button className="cart-button" disabled>
              <FaShoppingCart />
              Cart
              {state.cartCount > 0 && <span className="cart-badge">{state.cartCount}</span>}
            </button>
          </div>
        </header>
        <main className="container">
          <section className="products-section">
            <h2 className="section-title">Featured Products</h2>
            <div className="products-grid">
              <ProductSkeleton count={6} />
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="App">
        <header className="header">
          <div className="header-content">
            <h1 className="logo">Vibe Commerce</h1>
          </div>
        </header>
        <main className="container">
          <ErrorBoundary 
            message={state.error} 
            onRetry={fetchProducts}
          />
        </main>
      </div>
    );
  }

  // Destructure state for cleaner template
  const { 
    products, 
    cartItems, 
    cartTotal, 
    cartCount, 
    isCartOpen, 
    isCheckoutOpen, 
    isReceiptOpen, 
    receipt, 
    addingProduct 
  } = state;

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Vibe Commerce</h1>
          <button 
            className="cart-button" 
            onClick={() => updateState({ isCartOpen: true })}
            aria-label="View cart"
          >
            <FaShoppingCart />
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="products-section">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ErrorBoundary key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProduct === product.id}
                  />
                </ErrorBoundary>
              ))
            ) : (
              <div className="no-products">
                <FaExclamationTriangle className="no-products-icon" />
                <p>No products available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <ErrorBoundary>
        <CartSidebar
          isOpen={state.isCartOpen}
          onClose={() => updateState({ isCartOpen: false })}
          cartItems={state.cartItems}
          cartTotal={state.cartTotal}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => updateState({ isCheckoutOpen: false })}
          cartItems={cartItems}
          cartTotal={cartTotal}
          onSubmit={handleCheckoutSubmit}
        />

        <ReceiptModal
          isOpen={isReceiptOpen}
          onClose={handleReceiptClose}
          receipt={receipt}
        />
      </ErrorBoundary>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
