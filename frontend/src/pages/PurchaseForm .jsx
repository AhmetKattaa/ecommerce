import React, { useState } from 'react';

const PurchaseForm = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
        email: email,
        phone: phone
    };

    fetch('http://localhost/R/api/save_purchase.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Bilgiler kaydedildi.');
        } else {
            alert('Hata: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
};


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Telefon:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <button type="submit">Satın Al</button>
    </form>
  );
};

export default PurchaseForm;
