import React, { useState } from 'react';

 export const MapSearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ location, beds, baths });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Beds"
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
      />
      <input
        type="number"
        placeholder="Baths"
        value={baths}
        onChange={(e) => setBaths(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};


export default MapSearchBar;


