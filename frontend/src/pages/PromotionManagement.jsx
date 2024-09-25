import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Table, Modal } from 'react-bootstrap';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState({
    id: null,
    product_id: '',
    description: '',
    discount_percentage: '',
    active: false, // Varsayılan olarak false
  });

  // Promosyon ve ürünleri yükleyen fonksiyon
  const fetchPromotionsAndProducts = () => {
    // Promosyonları çekme
    fetch('http://localhost/R/api/get_promotions.php')
      .then(response => response.json())
      .then(data => setPromotions(data)) // Promosyonları state'e ekleme
      .catch(error => console.log('Error fetching promotions:', error));

    // Ürünleri çekme
    fetch('http://localhost/R/api/get_products.php')
      .then(response => response.json())
      .then(data => setProducts(data)) // Ürünleri state'e ekleme
      .catch(error => console.log('Error fetching products:', error));
  };

  useEffect(() => {
    fetchPromotionsAndProducts();
  }, []); // Sayfa yüklendiğinde bir kez çalışacak

  // Form gönderim işlemi
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', currentPromotion.id);
    formData.append('product_id', currentPromotion.product_id);
    formData.append('description', currentPromotion.description);
    formData.append('discount_percentage', currentPromotion.discount_percentage);
    formData.append('active', currentPromotion.active ? 1 : 0); // Active durumu ekleniyor

    if (isEditing) {
      editPromotion(formData);
    } else {
      addPromotion(formData);
    }
  };

  // Yeni promosyon ekleme
  const addPromotion = (formData) => {
    fetch('http://localhost/R/api/add_promotion.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsAdding(false);
          setPromotions([...promotions, data.promotion]); // Promosyonu listeye ekleme
        }
      })
      .catch(error => console.log('Error adding promotion:', error));
  };

  // Promosyonu düzenleme
  const editPromotion = (formData) => {
    fetch('http://localhost/R/api/edit_promotion.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsEditing(false);
          setPromotions(promotions.map(promo => (promo.id === currentPromotion.id ? currentPromotion : promo)));
        }
      })
      .catch(error => console.log('Error updating promotion:', error));
  };

  // Promosyonu silme
  const deletePromotion = (id) => {
    fetch('http://localhost/R/api/delete_promotion.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(() => setPromotions(promotions.filter(promo => promo.id !== id)))
      .catch(error => console.log('Error deleting promotion:', error));
  };

  // Düzenleme işlemi
  const editHandler = (promotion) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentPromotion(promotion);
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Promotion Management</h2>

      <Row className="mb-4">
        <Col className="text-end">
          <Button onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
            setCurrentPromotion({ id: null, product_id: '', description: '', discount_percentage: '', active: false });
          }} variant="success">Add Promotion</Button>
        </Col>
      </Row>

      <Modal 
        show={isEditing || isAdding} 
        onHide={() => {
          setIsEditing(false);
          setIsAdding(false);
          setCurrentPromotion({ id: null, product_id: '', description: '', discount_percentage: '', active: false });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Promotion' : 'Add Promotion'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="promotionProduct">
              <Form.Label>Product:</Form.Label>
              <Form.Control
                as="select"
                value={currentPromotion.product_id}
                onChange={(e) => setCurrentPromotion({ ...currentPromotion, product_id: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="promotionDescription" className="mt-3">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                value={currentPromotion.description}
                onChange={(e) => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="promotionDiscount" className="mt-3">
              <Form.Label>Discount Percentage:</Form.Label>
              <Form.Control
                type="number"
                value={currentPromotion.discount_percentage}
                onChange={(e) => setCurrentPromotion({ ...currentPromotion, discount_percentage: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="promotionActive" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={currentPromotion.active || false}  // Default olarak false
                onChange={(e) => setCurrentPromotion({ ...currentPromotion, active: e.target.checked })} // Checkbox kontrolü
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {isEditing ? 'Update Promotion' : 'Add Promotion'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Product</th>
            <th>Description</th>
            <th>Discount</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map(promo => (
            <tr key={promo.id}>
              <td>{products.find(product => product.id === promo.product_id)?.name || 'Unknown Product'}</td>
              <td>{promo.description}</td>
              <td>{promo.discount_percentage}%</td>
              <td>{promo.active == 1 ? 'Yes' : 'No'}</td>  {/* == ile kontrol yapıyoruz */}
              
              <td>
                <Button variant="warning" size="sm" onClick={() => editHandler(promo)} className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deletePromotion(promo.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PromotionManagement;
