import React from 'react';

const PainPoints = () => {
  return (
    <section className="mb-5">
      <h2 className="text-danger mb-3">Addressing Common Pain Points</h2>
      <p>
        PriFa Coffee is designed to solve the common issues faced by coffee lovers who are always on the move. 
        Forget about long brewing times, spills, and inconsistent taste.
      </p>
      <div className="row">
        <div className="col-md-6">
          <div className="card bg-light border-0 mb-3">
            <div className="card-body">
              <h5 className="card-title">No Time to Brew</h5>
              <p className="card-text">
                PriFa Coffee tablets provide an instant solution—no need to wait for your coffee to brew.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-light border-0 mb-3">
            <div className="card-body">
              <h5 className="card-title">Midday Fatigue</h5>
              <p className="card-text">
                A quick caffeine boost to keep you going through the midday slump without the crash.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
