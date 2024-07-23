import React, { useState } from "react";
import MapComponent from "./map";
import HomeSearch from "./homeSearch";
import ApartmentList from "./apartmentlist";

export const SearchPage = () => {
  const [mapData, setMapData] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    if (results && results.apartments) {
      const newMapData = results.apartments.map(apt => ({
        latitude: apt.location?.address?.coordinate?.lat || 0,
        longitude: apt.location?.address?.coordinate?.lon || 0,
        address: `${apt.location?.address?.line || ''}, ${apt.location?.address?.city || ''}, ${apt.location?.address?.state_code || ''} ${apt.location?.address?.postal_code || ''}`.trim(),
        price: apt.list_price || 0,
        bedrooms: apt.description?.beds || apt.description?.beds_max || 'N/A',
        bathrooms: apt.description?.baths || apt.description?.baths_max || 'N/A',
        living_area: apt.description?.sqft || apt.description?.sqft_max || 'N/A'
      }));
      setMapData(newMapData);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <h1>Apartment Map</h1>
          <MapComponent searchResults={mapData} />
        </div>
        <div className="col-md-4">
          <HomeSearch onSearchResults={handleSearchResults} />
        </div>
      </div>
      {searchResults && (
        <div className="row mt-4">
          <div className="col-12">
            <h2>Search Results</h2>
            <ApartmentList apartments={searchResults.apartments} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;