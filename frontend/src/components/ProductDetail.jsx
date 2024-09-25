import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useCart } from './cart/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [showAlert, setShowAlert] = useState(false);  // Uyarı kontrolü
  const [alertMessage, setAlertMessage] = useState('');  // Uyarı mesajı

  useEffect(() => {
    fetch(`http://localhost/R/api/get_product_detail.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        data.quantities = Array.isArray(data.quantities) ? data.quantities : [];
        data.variants = Array.isArray(data.variants) ? data.variants : [];
        data.flavors = Array.isArray(data.flavors) ? data.flavors : [];
        setProduct(data);
      })
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleFlavorChange = (event) => {
    setSelectedFlavor(event.target.value);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      flavor: selectedFlavor,
      image: product.image,
      promotion_active: product.promotion_active,
      promotion_discount_percentage: product.promotion_discount_percentage
    });

    // Uyarı mesajını ayarla ve göster
    setAlertMessage(`${product.name} has been added to the cart!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);  // Uyarıyı 3 saniye sonra gizle
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-fluid" />
        </Col>
        <Col md={6}>
          {/* Sepete eklenme uyarısı */}
          {showAlert && (
            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}

          <h1>{product.name}</h1>
          <p>{product.description}</p>

          {product.promotion_active === "1" ? (
            <>
              <p><strong>Discounted Price:</strong> {calculateDiscountedPrice(product.price, product.promotion_discount_percentage)} $</p>
              <p style={{ textDecoration: 'line-through' }}><strong>Original Price:</strong> {product.price} $</p>
            </>
          ) : (
            <p><strong>Price:</strong> {product.price} $</p>
          )}

          {product.variants.length > 0 && (
            <Form.Group controlId="productVariants">
              <Form.Label>Select Variant:</Form.Label>
              <Form.Control as="select">
                {product.variants.map((variant, index) => (
                  <option key={index} value={variant.color}>
                    {variant.color}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          {product.quantities.length > 0 && (
            <Form.Group controlId="productQuantities" className="mt-3">
              <Form.Label>Select Quantity:</Form.Label>
              <Form.Control as="select">
                {product.quantities.map((quantity, index) => (
                  <option key={index} value={quantity.label}>
                    {quantity.label} - {quantity.price} $
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          {product.flavors.length > 0 && (
            <Form.Group controlId="productFlavors" className="mt-3">
              <Form.Label>Select Flavor:</Form.Label>
              {product.flavors.map((flavor, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  label={flavor}
                  name="flavorOptions"
                  value={flavor}
                  checked={selectedFlavor === flavor}
                  onChange={handleFlavorChange}
                  className="mb-2"
                />
              ))}
            </Form.Group>
          )}

          <Button variant="warning" className="mt-3" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
