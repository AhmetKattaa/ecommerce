import React, { createContext, useContext, useState, useEffect } from 'react';

// CartContext'i oluştur
const CartContext = createContext();

// CartProvider bileşeni
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [message, setMessage] = useState('');

  // Sepet güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Mesajı belirli süre sonra sıfırlama
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000); // 3 saniye sonra mesajı temizle
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const uniqueKey = `${product.id}-${product.flavor || 'default'}`;
      const existingProductIndex = prevItems.findIndex((item) => item.uniqueKey === uniqueKey);

      // Fiyatı sayıya dönüştür ve promosyon varsa yeni fiyatı hesapla
      let priceToAdd = parseFloat(product.price);
      if (product.promotion_active === "1") {
        priceToAdd = (priceToAdd - (priceToAdd * product.promotion_discount_percentage / 100)).toFixed(2);
      }

      if (existingProductIndex !== -1) {
        const updatedCartItems = [...prevItems];
        updatedCartItems[existingProductIndex].quantity += product.quantity || 1;
        return updatedCartItems;
      } else {
        return [...prevItems, { ...product, uniqueKey, price: priceToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === productId);
      if (existingProduct && existingProduct.quantity > 1) {
        showMessage(`Miktarı azaltıldı: ${existingProduct.name}`);
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        showMessage(`Sepetten çıkarıldı: ${existingProduct.name}`);
        return prevItems.filter((item) => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
    showMessage('Sepet tamamen boşaltıldı.');
  };

  // Toplam fiyatı hesaplama fonksiyonu
  const totalPrice = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0).toFixed(2);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, message, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// useCart hook'u
export const useCart = () => {
  return useContext(CartContext);
};
