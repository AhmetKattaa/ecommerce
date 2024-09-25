import React, { useState } from 'react';
import { useCart } from './CartContext';

const Checkout = () => {
  const { cartItems, clearCart, totalPrice } = useCart();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleSubmit = (event) => {
    event.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Lütfen geçerli bir telefon numarası girin.');
      return;
    }

    const orderData = {
      email,
      phone,
      address,
      payment_method: paymentMethod,
      total_amount: totalPrice,
      products: cartItems.map(product => ({ id: product.id, name: product.name, price: product.price })),
    };

    fetch('http://localhost/R/api/checkout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          clearCart();
          alert('Sipariş başarıyla oluşturuldu!');
          window.location.href = "/thank-you";
        } else {
          alert('Sipariş oluşturulurken hata oluştu.');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone: </label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Address: </label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label>Payment Method: </label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="credit_card">Credit Card</option>
            <option value="google_pay">Google Pay</option>
          </select>
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
