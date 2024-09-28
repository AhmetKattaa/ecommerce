import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Offcanvas, Button, Table, Toast } from 'react-bootstrap'; // Toast import edildi
import { Link } from 'react-router-dom';
import '../css/Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../components/cart/CartContext';

function NavBar() {
  const [showCart, setShowCart] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false); // Toast kontrolü
  const { cartItems, removeFromCart, addToCart, clearCart, totalPrice } = useCart();
  const navbarRef = useRef(null);

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  // Ürün sepete eklendiğinde otomatik açılması
  useEffect(() => {
    if (cartItems.length > 0) {
      handleShowCart();
    }
  }, [cartItems]);

  const handleMenuItemClick = () => {
    setMenuExpanded(false);
  };

  // Sayfanın menü veya navbar dışında kalan alanına tıklanınca menüyü kapatma
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuExpanded && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuExpanded]);

  // Miktarı azaltma fonksiyonu (Counter)
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 });
    }
  };

  // Miktarı artırma fonksiyonu (Counter)
  const increaseQuantity = (item) => {
    addToCart({ ...item, quantity: item.quantity + 1 });
  };

  // Sepeti temizleyince Offcanvas'ı otomatik kapatma ve toast gösterme
  const handleClearCart = () => {
    clearCart();
    handleCloseCart(); // Sepet boşalınca Offcanvas'ı kapat
    setShowToast(true); // Toast'ı göster
    setTimeout(() => setShowToast(false), 3000); // 3 saniye sonra toast'ı gizle
  };

  return (
    <>
      <Navbar
        ref={navbarRef}
        expanded={menuExpanded}
        onToggle={() => setMenuExpanded(!menuExpanded)}
        className="sticky-top"
        style={{ backgroundColor: "#6C4035", color: "white" }}
        variant="dark"
        expand="lg"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-none d-lg-block">
            <img src="//prifaco.com/cdn/shop/files/prifa_logo_white_4x_863e8830-cccb-429c-a529-63a87b8374e5.png?v=1724814470&width=80" alt="Prifa Logo" />
          </Navbar.Brand>

          <div className="d-flex w-100 justify-content-between align-items-center d-lg-none">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand as={Link} to="/" className="mx-auto">
              <img src="//prifaco.com/cdn/shop/files/prifa_logo_white_4x_863e8830-cccb-429c-a529-63a87b8374e5.png?v=1724814470&width=80" alt="Prifa Logo" />
            </Navbar.Brand>
            <Button variant="link" onClick={handleShowCart}>
              <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white', fontSize: '1.5rem' }} />
            </Button>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/admin" onClick={handleMenuItemClick}>Admin</Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={handleMenuItemClick}>About</Nav.Link>
              <Nav.Link as={Link} to="/products" onClick={handleMenuItemClick}>Products</Nav.Link>
              <Nav.Link as={Link} to="/blogs" onClick={handleMenuItemClick}>Blogs</Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={handleMenuItemClick}>Contact</Nav.Link>
              <Button variant="link" className="d-none d-lg-block" onClick={handleShowCart}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white', fontSize: '1.5rem' }} />
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Toast (Bildirim) */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Sepet Boşaltıldı</strong>
          </Toast.Header>
          <Toast.Body>Sepetiniz başarıyla boşaltıldı!</Toast.Body>
        </Toast>
      </div>

      {/* Sepet Offcanvas */}
      <Offcanvas show={showCart} onHide={handleCloseCart} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sepetiniz</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length > 0 ? (
            <>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Fiyat</th>
                    <th>Miktar</th>
                    <th>Toplam</th>
                    <th>İşlemler</th>
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
                              {parseFloat(item.original_price).toFixed(2)} $
                            </span>
                            <span style={{ color: 'red' }}>
                              {parseFloat(item.price).toFixed(2)} $ {/* İndirimli fiyat */}
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
                          Çıkar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h3 className="mt-4 text-center">Toplam: {totalPrice} $</h3>

              <div className="text-center mt-4">
                <Button variant="secondary" onClick={handleClearCart}> {/* Sepeti Temizle Butonuna handleClearCart ekliyoruz */}
                  Sepeti Temizle
                </Button>
              </div>
            </>
          ) : (
            <p>Sepetiniz boş.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBar;
