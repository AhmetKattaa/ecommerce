import React from 'react';

const Objections = () => {
  return (
    <section className="mb-5">
      <h2 className="text-muted mb-3">Addressing Objections</h2>
      <p>
        While PriFa Coffee tablets have many benefits, we understand they may not suit everyone's taste preferences. 
        Here’s how we address some common objections:
      </p>
      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 mb-3">
            <div className="card-body">
              <h5 className="card-title text-danger">Taste</h5>
              <p className="card-text">
                Some users find the taste bitter due to the lack of sweeteners. PriFa Coffee is perfect for those 
                who appreciate a strong, black coffee flavor.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 mb-3">
            <div className="card-body">
              <h5 className="card-title text-danger">Acidity Sensitivity</h5>
              <p className="card-text">
                For those sensitive to acidic flavors, our tablets provide a natural coffee taste without artificial 
                sweeteners, catering to purists who prefer an authentic coffee experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Objections;
