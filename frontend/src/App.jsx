import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Products from './pages/Products';
import Admin from './pages/Admin';
import About from './pages/About';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './components/cart/Checkout';
import { CartProvider } from './components/cart/CartContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './pages/PrivateRoute';

function App() {
  return (
    <CartProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<PrivateRoute> <Admin /></PrivateRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} /> {/* Slug kullanılıyor */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
