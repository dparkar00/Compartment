import React from 'react';

const ApartmentList = ({ apartments }) => {
  const handleImageError = (e, apartment) => {
    console.error(`Error loading image for apartment: ${apartment.address}`);
    console.error(`Image URL: ${apartment.imageUrl || apartment.image_url}`);
    e.target.src = 'https://via.placeholder.com/150?text=No+Image'; // Placeholder image
  };

  return (
    <div className="scrollable-container">
      {apartments.map((apartment, index) => {
        console.log(`Rendering apartment ${index + 1}:`, apartment);
        const imageUrl = apartment.imageUrl || apartment.image_url;
        console.log(`Image URL for apartment ${index + 1}:`, imageUrl);
        return (
          <div key={index} className="apartment-item mb-3">
            <img
              className="img-fluid apartment-image"
              src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
              alt={`Apartment ${index + 1}`}
              onError={(e) => handleImageError(e, apartment)}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="apartment-details">
              <h5>{apartment.address}</h5>
              <p>Price: ${apartment.price.toLocaleString()}</p>
              <p>{apartment.bedrooms} bed, {apartment.bathrooms} bath, {apartment.livingArea || apartment.living_area} sqft</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApartmentList;