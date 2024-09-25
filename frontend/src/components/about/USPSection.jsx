import React from 'react';

const USPSection = () => {
  return (
    <section className="mb-5">
      <h2 className="text-success mb-3">Benefits & Unique Selling Points</h2>
      <p>
        PriFa Coffee combines the rich taste of high-quality coffee with ultimate convenience. 
        No brewing, no waiting—just place a tablet in your mouth and enjoy a smooth caffeine 
        boost anytime, anywhere.
      </p>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Ultimate Convenience</h5>
              <p className="card-text">
                Perfect for on-the-go moments. Forget about hot water or brewing—just pop a 
                tablet in your mouth.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Ideal for Busy Lifestyles</h5>
              <p className="card-text">
                Whether you’re a student, professional, or traveler, PriFa Coffee tablets fit 
                seamlessly into your busy routine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;
