import React, { useState } from 'react';
import axios from 'axios';
import '../../css/custom.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/R/api/send_email.php', formData);
      setSubmitted(true);
      setError('');
      alert(response.data.message);
    } catch (error) {
      setError('An error occurred while sending the message.');
      console.error(error);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm" style={{ borderColor: '#6C4035' }}>
        <div className="card-body" style={{ backgroundColor: '#F5F3F2' }}>
          <h2 className="card-title text-center mb-4" style={{ color: '#6C4035' }}>Contact Form</h2>
          {submitted ? (
            <p className="text-center" style={{ color: '#6C4035' }}>Your message has been sent successfully!</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label" style={{ color: '#6C4035' }}>Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label" style={{ color: '#6C4035' }}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label" style={{ color: '#6C4035' }}>Your Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn" style={{ backgroundColor: '#6C4035', color: '#FFFFFF', border: 'none', transition: 'background-color 0.3s ease' }}>
                Send
              </button>
              {error && <p className="text-danger mt-3">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
