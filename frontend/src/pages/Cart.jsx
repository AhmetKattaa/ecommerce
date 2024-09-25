import React from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useCart } from '../components/cart/CartContext';
import ProductCard from '../components/ProductCard'; // Similar Products için ProductCard bileşenini kullanıyoruz.

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, clearCart, message, totalPrice } = useCart();

  // Miktarı azaltma fonksiyonu
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    }
  };

  // Miktarı artırma fonksiyonu
  const increaseQuantity = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  return (
    <Container className="my-4">
      <h2>Your Cart</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {cartItems.length > 0 ? (
        <>
          {/* Sepet Tablosu */}
          <Table responsive striped bordered hover className="table-responsive-sm">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      width="50" 
                      className="d-block mx-auto mb-2" 
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="text-center">
                    {item.promotion_active === "1" ? (
                      <>
                        <span style={{ textDecoration: 'line-through', marginRight: '10px' }}>
                          {(parseFloat(item.price) / (1 - item.promotion_discount_percentage / 100)).toFixed(2)} $
                        </span>
                        <span style={{ color: 'red' }}>
                          {item.price} $
                        </span>
                      </>
                    ) : (
                      <span>{item.price} $</span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <Button variant="light" onClick={() => decreaseQuantity(item)}>-</Button>
                      <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                      <Button variant="light" onClick={() => increaseQuantity(item)}>+</Button>
                    </div>
                  </td>
                  <td className="text-center">{(parseFloat(item.price) * item.quantity).toFixed(2)} $</td>
                  <td className="text-center">
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Toplam Fiyat */}
          <h3 className="mt-4 text-center">Total: {totalPrice} $</h3>
          <div className="text-center">
            <Button variant="secondary" onClick={clearCart} className="mt-3">
              Clear Cart
            </Button>
          </div>

          {/* Similar Products Bölümü */}
          <h3 className="mt-5 text-center">Similar Products</h3>
          <div className="d-flex justify-content-center">
            <ProductCard /> {/* Bu bölüm tüm ürünleri benzer ürünler olarak gösteriyor */}
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </Container>
  );
};

export default Cart;
