import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductCard from '../components/ProductCard';
import BlogList from './BlogList';

const Home = () => {
  return (
    <div>
      <section className="hero bg-dark text-white text-center p-5">
        <div className="container">
          <h1 className="display-4">Welcome to Prifa Coffee</h1>
          <p className="lead">Discover the best coffee from around the world</p>
          <a href="/products" className="btn btn-lg" style={{backgroundColor:"#6c4035"}}>Shop Now</a>
        </div>
      </section>

      <section className="about py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src="https://prifaco.com/cdn/shop/articles/WhatsApp-Image-2024-02-22-at-21.55.png?v=1724488628&width=750" className="img-fluid" alt="About Prifa Coffee" />
            </div>
            <div className="col-md-6">
              <h2>About Us</h2>
              <p>At Prifa Coffee, we believe in delivering the highest quality coffee. Our beans are sourced from the finest farms around the world, and each batch is roasted to perfection.</p>
              <a href="/about" className="btn btn-outline-dark">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className='blog py-5'>
        <h1 className="text-center mb-4">Blog Posts</h1>
        <BlogList />
      </section>

      {/* Products */}
      <section className="products bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Our Products</h2>
          <ProductCard />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews py-5">
        <div className="container">
          <h2 className="text-center mb-4">Customer Reviews</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="p-3 bg-light border rounded">
                <p className="mb-2">"The best coffee I've ever had!"</p>
                <p className="text-muted mb-0">- John Doe</p>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="p-3 bg-light border rounded">
                <p className="mb-2">"Great taste and amazing quality!"</p>
                <p className="text-muted mb-0">- Jane Smith</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact bg-dark text-white text-center py-5">
        <div className="container">
          <h2>Contact Us</h2>
          <p>If you have any questions or would like to get in touch, please contact us.</p>
          <a href="/contact" className="btn btn-outline-light">Contact Us</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
