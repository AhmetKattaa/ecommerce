import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap';
import Appointment from './../components/contact/Appointment';
import ContactForm from './../components/contact/ContactForm';

const ContactPage = () => {
  const [activeKey, setActiveKey] = useState('contact'); // Default olarak "contact" sekmesi açık
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar görünürlüğü kontrolü

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Yan Bar (Desktop için sabit, mobil için gizli) */}
        <Col xs={12} lg={2} className={`bg-dark text-white ${showSidebar ? 'd-block' : 'd-none'} d-lg-block vh-100`}>
          <Nav variant="pills" className="flex-column p-3" onSelect={(selectedKey) => { setActiveKey(selectedKey); setShowSidebar(false); }}>
            <Nav.Item>
              <Nav.Link
                eventKey="contact"
                className="text-white"
                style={{
                  backgroundColor: activeKey === 'contact' ? '#6C4035' : 'transparent',
                  color: activeKey === 'contact' ? '#FFFFFF' : '#FFFFFF',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Contact Form
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="appointment"
                className="text-white"
                style={{
                  backgroundColor: activeKey === 'appointment' ? '#6C4035' : 'transparent',
                  color: activeKey === 'appointment' ? '#FFFFFF' : '#FFFFFF',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Appointment
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Toggle Sidebar Button (Mobil için görünür) */}
        <Col xs={12} className="d-lg-none p-2">
          <Button variant="dark" onClick={toggleSidebar} style={{ backgroundColor: '#6C4035', color: '#FFFFFF' }}>
            {showSidebar ? 'Close Menu' : 'Open Menu'}
          </Button>
        </Col>

        {/* İçerik Bölümü */}
        <Col xs={12} lg={10} className="p-4">
          <Tab.Content>
            <Tab.Pane eventKey="contact" active={activeKey === 'contact'}>
              <ContactForm />
            </Tab.Pane>
            <Tab.Pane eventKey="appointment" active={activeKey === 'appointment'}>
              <Appointment />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
