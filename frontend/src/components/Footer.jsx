import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4" style={{ backgroundColor: '#6C4035' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              We are a company dedicated to providing the best services in the industry. Our mission is to deliver quality products and exceptional customer service.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
              <li><Link to="/products" className="text-white text-decoration-none">Products</Link></li>
              <li><Link to="/blogs" className="text-white text-decoration-none">Blogs</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              Email: info@prifaco.com <br />
              Phone: +123 456 7890
            </p>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; 2024 Prifa. All rights reserved.</p>
            <p>Created by <a href="https://ahmadkattaa.great-site.net/">Ahmad KATTAA</a></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
