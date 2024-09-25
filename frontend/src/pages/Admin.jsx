import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BlogManagement from './BlogManagement';
import PromotionManagement from './PromotionManagement';
import ProductManagement from './ProductManagement ';
import CategoryManagement from './CategoryManagement ';

const Admin = () => {
  const [activeKey, setActiveKey] = useState('products');
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('token');  // JWT token'ı sil
    navigate('/login');  // /login sayfasına yönlendir
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} lg={2} className={`text-white ${showSidebar ? 'd-block' : 'd-none'} d-lg-block vh-100`} style={{ backgroundColor: "#6C4035" }}>
          <Nav variant="pills" className="flex-column p-3" onSelect={(selectedKey) => { setActiveKey(selectedKey); setShowSidebar(false); }}>
            <Nav.Item>
              <Nav.Link eventKey="products" className="text-white" style={{ backgroundColor: activeKey === 'products' ? '#5A352C' : 'transparent' }}>
                Product Manager
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="blogs" className="text-white" style={{ backgroundColor: activeKey === 'blogs' ? '#5A352C' : 'transparent' }}>
                Blog Manager
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="categories" className="text-white" style={{ backgroundColor: activeKey === 'categories' ? '#5A352C' : 'transparent' }}>
                Category Manager
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="promotions" className="text-white" style={{ backgroundColor: activeKey === 'promotions' ? '#5A352C' : 'transparent' }}>
                Promotion Manager
              </Nav.Link>
            </Nav.Item>
            {/* Çıkış Butonu */}
            <Nav.Item>
              <Button variant="light" className="mt-4" style={{ color: '#6C4035' }} onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          </Nav>
        </Col>

        <Col xs={12} className="d-lg-none p-2">
          <Button variant="light" onClick={toggleSidebar} style={{ backgroundColor: '#6C4035', color: 'white' }}>
            {showSidebar ? 'Close Menu' : 'Open Menu'}
          </Button>
        </Col>

        <Col xs={12} lg={10} className="p-4">
          <Tab.Content>
            <Tab.Pane eventKey="products" active={activeKey === 'products'}>
              <ProductManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="blogs" active={activeKey === 'blogs'}>
              <BlogManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="categories" active={activeKey === 'categories'}>
              <CategoryManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="promotions" active={activeKey === 'promotions'}>
              <PromotionManagement />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
