import React from 'react';

const ApartmentList = ({ apartments }) => {
  const handleImageError = (e, apartment) => {
    console.error(`Error loading image for apartment: ${apartment.address}`);
    console.error(`Image URL: ${apartment.imageUrl || apartment.image_url}`);
    e.target.src = 'https://via.placeholder.com/150?text=No+Image'; // Placeholder image
  };

  return (
    <div className="apartment-list">
      {apartments.map((apartment, index) => {
        const imageUrl = apartment.imageUrl || apartment.image_url;
        return (
          <div key={index} className="house-info">
            <div className="house-image">
              <img
                src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                alt={`Apartment ${index + 1}`}
                onError={(e) => handleImageError(e, apartment)}
              />
            </div>
            <div className="house-price">
              <span>${apartment.price.toLocaleString()}</span>
            </div>
            <ul className="house-meta">
              <li>{apartment.address}</li>
              <li>{apartment.livingArea || apartment.living_area} sqft</li>
              <li>{apartment.bedrooms} bed, {apartment.bathrooms} bath</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ApartmentList;


// import React from 'react';
// import MapComponent from './map';


// const ApartmentList = ({ apartments }) => {
//   const handleImageError = (e, apartment) => {
//     console.error(`Error loading image for apartment: ${apartment.address}`);
//     console.error(`Image URL: ${apartment.imageUrl || apartment.image_url}`);
//     e.target.src = 'https://via.placeholder.com/150?text=No+Image'; // Placeholder image
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-8">
//           <div className="scrollable-container">
//             {apartments.map((apartment, index) => {
//               const imageUrl = apartment.imageUrl || apartment.image_url;
//               return (
//                 <div key={index} className="apartment-item mb-3 d-flex">
//                   <div className="apartment-image-container">
//                     <img
//                       className="apartment-image"
//                       src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
//                       alt={`Apartment ${index + 1}`}
//                       onError={(e) => handleImageError(e, apartment)}
//                     />
//                   </div>
//                   <div className="apartment-details ml-3">
//                     <h5>{apartment.address}</h5>
//                     <p>Price: ${apartment.price.toLocaleString()}</p>
//                     <p>{apartment.bedrooms} bed, {apartment.bathrooms} bath, {apartment.livingArea || apartment.living_area} sqft</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="map-component">
//             <MapComponent searchResults={apartments} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApartmentList;