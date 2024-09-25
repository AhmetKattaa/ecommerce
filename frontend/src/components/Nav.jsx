import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // FontAwesome bileşeni
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';  // Sepet ikonu

function NavBar() {
  return (
    <Navbar className="fixed-up" style={{ backgroundColor: "#6C4035", color: "white" }} variant="dark" expand="lg">
      <Container>
        {/* Logo masaüstünde sola yaslı */}
        <Navbar.Brand as={Link} to="/" className="d-none d-lg-block">
          <img src="//prifaco.com/cdn/shop/files/prifa_logo_white_4x_863e8830-cccb-429c-a529-63a87b8374e5.png?v=1724814470&width=80" alt="Prifa Logo" />
        </Navbar.Brand>

        {/* Mobil görünümde logo ortada, menü sol, sepet sağ */}
        <div className="d-flex w-100 justify-content-between align-items-center d-lg-none">
          {/* Menü ikonu sol tarafta sadece mobilde */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          {/* Logo ortada mobilde */}
          <Navbar.Brand as={Link} to="/" className="mx-auto">
            <img src="//prifaco.com/cdn/shop/files/prifa_logo_white_4x_863e8830-cccb-429c-a529-63a87b8374e5.png?v=1724814470&width=80" alt="Prifa Logo" />
          </Navbar.Brand>
          
          {/* Sepet ikonu sağda sadece mobilde */}
          <Nav.Link as={Link} to="/cart">
            <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white', fontSize: '1.5rem' }} /> {/* Sepet ikonu */}
          </Nav.Link>
        </div>

        {/* Menü ve sepet masaüstü görünüm için */}
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            {/* Sepet ikonu sadece masaüstü görünümde */}
            <Nav.Link as={Link} to="/cart" className="d-none d-lg-block">
              <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white', fontSize: '1.5rem' }} /> {/* Sepet ikonu */}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
