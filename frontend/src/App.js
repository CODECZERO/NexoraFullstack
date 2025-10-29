import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import CheckoutModal, { ReceiptModal } from './components/CheckoutModal';
import {
  getProducts,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProduct, setAddingProduct] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      // The backend returns { success, count, data } structure
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        // Fallback to the response directly if it's an array
        setProducts(Array.isArray(response) ? response : []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
      setProducts([]); // Ensure products is always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await getCart();
      // The cart response might be nested in a data property or be the direct response
      const cartData = response.data || response;
      setCartItems(cartData.items || []);
      setCartTotal(cartData.total || 0);
      setCartCount(cartData.items ? cartData.items.length : 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      // Initialize empty cart on error
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setAddingProduct(product.id);
      const response = await addToCart(product.id, 1);
      // The response might be nested in a data property or be the direct response
      const cartData = response.data || response;
      setCartItems(cartData.items || []);
      setCartTotal(cartData.total || 0);
      setCartCount(cartData.items ? cartData.items.length : 0);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error(err.message || 'Failed to add item to cart');
    } finally {
      setAddingProduct(null);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await updateCartItem(productId, newQuantity);
      // The response might be nested in a data property or be the direct response
      const cartData = response.data || response;
      setCartItems(cartData.items || []);
      setCartTotal(cartData.total || 0);
      setCartCount(cartData.items ? cartData.items.length : 0);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await removeFromCart(productId);
      // Ensure we have valid cart data before updating state
      if (response && response.items) {
        setCartItems(response.items);
        setCartTotal(response.total || 0);
        setCartCount(response.items.length);
        toast.success('Item removed from cart');
      } else {
        // If response doesn't contain items, refetch the cart
        const { data } = await getCart();
        setCartItems(data.items || []);
        setCartTotal(data.total || 0);
        setCartCount(data.items ? data.items.length : 0);
        toast.success('Item removed from cart');
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove item';
      toast.error(errorMessage);
      
      // If the error is because the item wasn't found, refresh the cart
      if (errorMessage.includes('not found')) {
        try {
          const { data } = await getCart();
          setCartItems(data.items || []);
          setCartTotal(data.total || 0);
          setCartCount(data.items ? data.items.length : 0);
        } catch (refreshError) {
          console.error('Error refreshing cart:', refreshError);
        }
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (name, email) => {
    try {
      const response = await checkout(name, email, cartItems);
      setReceipt(response.data);
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
      
      // Refresh cart after successful checkout
      await fetchCart();
      
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to process checkout');
    }
  };

  const handleReceiptClose = () => {
    setIsReceiptOpen(false);
    setReceipt(null);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Vibe Commerce</h1>
          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingProduct === product.id}
              />
            ))}
          </div>
        </section>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onSubmit={handleCheckoutSubmit}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleReceiptClose}
        receipt={receipt}
      />

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
