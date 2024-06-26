// src/components/PropertyListing.jsx
import React from 'react';

export const PropertyListing = ({ property }) => {
  return (
    <div>
      <h3>{property.location.address.line}, {property.location.address.city}, {property.location.address.state_code} {property.location.address.postal_code}</h3>
      <p>Price: ${property.list_price}</p>
      <p>{property.description.beds || property.description.beds_max} beds, {property.description.baths || property.description.baths_max} baths</p>
    </div>
  );
};

export default PropertyListing;
