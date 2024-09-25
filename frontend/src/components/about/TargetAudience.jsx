import React from 'react';

const TargetAudience = () => {
  return (
    <section className="mb-5">
      <h2 className="text-info mb-3">Target Audience</h2>
      <p>
        PriFa Coffee caters to a diverse range of coffee lovers who value convenience and portability. Whether you’re 
        rushing to a meeting, studying for exams, or just need a quick boost, our coffee tablets fit seamlessly into 
        your lifestyle.
      </p>
      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-secondary">Busy Professionals</h5>
              <p className="card-text">
                Perfect for professionals who are always on the move and need a quick, no-mess caffeine solution.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-secondary">Students</h5>
              <p className="card-text">
                Ideal for students who need to stay alert during long study sessions or exam preparations.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-secondary">Travelers</h5>
              <p className="card-text">
                Portable and easy to use, PriFa Coffee is a great companion for those constantly on the go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
