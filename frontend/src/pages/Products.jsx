import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../components/cart/CartContext';  // Sepete eklemek için kullanılıyor

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [showAlert, setShowAlert] = useState(false);  // Uyarı mesajı kontrolü
  const [alertMessage, setAlertMessage] = useState('');  // Uyarı mesajı içeriği

  useEffect(() => {
    fetch('http://localhost/R/api/get_products.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  // Sepete ekleme işlemi ve uyarı gösterme
  const handleBuyNow = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      promotion_active: product.promotion_active,
      promotion_discount_percentage: product.promotion_discount_percentage
    });

    setAlertMessage(`${product.name} has been added to the cart!`);
    setShowAlert(true);  // Uyarıyı göster
    setTimeout(() => setShowAlert(false), 3000);  // 3 saniye sonra uyarıyı kapat
  };

  return (
    <Container>
      <h2 className="text-center mb-4" style={{ color: "#6C4035" }}>Products</h2>

      {/* Sepete eklenme uyarısı */}
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}

      <Row>
        {products.map(product => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100" style={{ borderColor: "#6C4035", backgroundColor: "#EEE1D3" }}>
              <Card.Img 
                variant="top" 
                src={product.image} 
                alt={product.name} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
              <Card.Body>
                <Card.Title style={{ color: "#6C4035" }}>{product.name}</Card.Title>
                {product.promotion_active === "1" ? (
                  <>
                    <Card.Text style={{ color: "red" }}>
                      Discounted Price: {calculateDiscountedPrice(product.price, product.promotion_discount_percentage)} $
                    </Card.Text>
                    <Card.Text style={{ textDecoration: 'line-through', color: 'gray' }}>
                      Original Price: {product.price} $
                    </Card.Text>
                  </>
                ) : (
                  <Card.Text>Price: {product.price} $</Card.Text>
                )}
                <div className="d-flex justify-content-between">
                  {/* View Details Butonu */}
                  <Link 
                    to={`/products/${product.id}`} 
                    className="btn btn-outline-primary"
                    style={{ 
                      borderColor: "#6C4035", 
                      color: "#6C4035", 
                      transition: 'background-color 0.3s ease, color 0.3s ease' 
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#6C4035';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6C4035';
                    }}
                  >
                    View Details
                  </Link>
                  {/* Buy Now Butonu */}
                  <Button 
                    variant="success" 
                    onClick={() => handleBuyNow(product)} 
                    style={{ 
                      backgroundColor: "#6C4035", 
                      borderColor: "#6C4035" 
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;
