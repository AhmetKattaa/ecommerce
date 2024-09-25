import React from 'react';

const Features = () => {
  return (
    <section className="mb-5">
      <h2 className="text-warning mb-3">Key Features</h2>
      <p>
        PriFa Coffee tablets are packed with features that make them a preferred choice for those seeking a 
        quick, healthy, and convenient coffee option.
      </p>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3" style={{backgroundColor:"#AA1F23",color:"white"}}>
            <div className="card-body">
              <h5 className="card-title">No Crash or Jitters</h5>
              <p className="card-text">
                Enjoy a smooth energy boost without the typical caffeine crash or jitters.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3" style={{backgroundColor:"#198754",color:"white"}}>
            <div className="card-body">
              <h5 className="card-title">Health-Conscious Ingredients</h5>
              <p className="card-text">
                Made from high-quality ground coffee and Arabic gum, these tablets are vegan, non-GMO, and 
                free from added sugars and gluten.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3" style={{backgroundColor:"#6C4035",color:"white"}}>
            <div className="card-body">
              <h5 className="card-title">Eco-Friendly</h5>
              <p className="card-text">
                PriFa Coffee is not only good for you but also for the environment with minimal packaging waste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
