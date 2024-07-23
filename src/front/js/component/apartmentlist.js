import React from 'react';

const ApartmentList = ({ apartments }) => {
  return (
    <div className="scrollable-container">
      {apartments.map((apartment, index) => (
        <div key={index} className="apartment-item mb-3">
          <img
            className="img-fluid apartment-image"
            src={apartment.image_url || 'placeholder-image-url.jpg'}
            alt={`Apartment ${index + 1}`}
            style={{ maxWidth: '100%', height: 'auto' }} // Adjust the image size
          />
          <div className="apartment-details">
            <h5>{apartment.address}</h5>
            <p>Price: ${apartment.price}</p>
            <p>{apartment.bedrooms} bed, {apartment.bathrooms} bath, {apartment.living_area} sqft</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentList;