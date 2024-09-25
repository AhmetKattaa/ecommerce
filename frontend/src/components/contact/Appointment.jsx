import React, { useState } from 'react';
import '../../css/custom.css';

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00'];

  return (
    <div className="container my-4">
      <div className="card shadow-sm" style={{ borderColor: '#6C4035' }}>
        <div className="card-body" style={{ backgroundColor: '#F5F3F2' }}>
          <h2 className="card-title text-center mb-4" style={{ color: '#6C4035' }}>Book an Appointment</h2>
          <div className="mb-3">
            <label htmlFor="date" className="form-label" style={{ color: '#6C4035' }}>Select a Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#6C4035' }}>Select a Time</label>
            <div className="d-flex flex-wrap justify-content-center">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`btn m-2 ${selectedTime === time ? 'btn-primary' : 'btn-outline-primary'}`}
                  style={{
                    backgroundColor: selectedTime === time ? '#6C4035' : 'transparent',
                    color: selectedTime === time ? '#FFFFFF' : '#6C4035',
                    borderColor: '#6C4035',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                  }}
                  onClick={() => handleTimeChange(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          <p className="text-center" style={{ color: '#6C4035' }}>
            Selected Appointment: {selectedDate} - {selectedTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
