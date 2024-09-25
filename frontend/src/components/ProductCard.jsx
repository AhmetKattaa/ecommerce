import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../css/ProductCard.css';
import { useCart } from './cart/CartContext';  // Sepete eklemek için kullanılıyor

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost/R/api/get_products.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleBuyNow = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      promotion_active: product.promotion_active,
      promotion_discount_percentage: product.promotion_discount_percentage
    });
  };

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={4}
      navigation={true}
      modules={[Navigation]}
      className="product-slider m-4 p-3"
      style={{
        backgroundColor: "#6C4035",
        borderRadius: 25,
        color: "white"
      }}
      breakpoints={{
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1440: { slidesPerView: 4 }
      }}
    >
      {products.map(product => (
        <SwiperSlide key={product.id}>
          <div style={{ padding: '10px', width: '250px' }}>
            <Card className="mb-3" 
              style={{ backgroundColor: "#EEE1D3", borderColor: "#6C4035", transition: 'transform 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Card.Img 
                variant="top" 
                src={product.image} 
                alt={product.name} 
                style={{ height: '200px', objectFit: 'cover', borderRadius: "10px" }} 
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
                  <Card.Text style={{ color: "#6C4035" }}>Price: {product.price} $</Card.Text>
                )}
                <div className="d-flex justify-content-between">
                  <Link 
                    to={`/products/${product.id}`} 
                    className="btn btn-outline-primary"
                    style={{ borderColor: "#6C4035", color: "#6C4035", transition: 'background-color 0.3s ease, color 0.3s ease' }}
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
                  <Button 
                    variant="success" 
                    onClick={() => handleBuyNow(product)} 
                    style={{ backgroundColor: "#6C4035", borderColor: "#6C4035" }}
                  >
                    Buy Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCard;
