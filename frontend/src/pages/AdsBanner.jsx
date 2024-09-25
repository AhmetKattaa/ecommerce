import React, { useState, useEffect } from 'react';

const AdsBanner = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch('http://localhost/R/api/get_ads.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setAds(data))
      .catch(error => console.error('Error fetching ads:', error));
  }, []);

  return (
    <div className="ads-banner">
      {ads.length > 0 ? (
        ads.map(ad => (
          <div key={ad.id} style={{ background: ad.color, padding: '10px' }}>
            <h3>{ad.title}</h3>
            <p>{ad.content}</p>
          </div>
        ))
      ) : (
        <p>Aktif bir reklam yok.</p>
      )}
    </div>
  );
};

export default AdsBanner;
