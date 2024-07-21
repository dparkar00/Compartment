import React, { useState } from 'react';


function HomeSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');



  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Starting handleSubmit');

    setLoading(true);
    setError(null);

    try {
      console.log("Parsing user input");
      const preferences = parsePreferences(userPrompt);
      console.log("Parsed preferences:", preferences);

      if (!preferences) {
        throw new Error('Could not parse input. Please describe your preferences clearly.');
      }

      const url = "https://bug-free-train-r4pxjxgx5vp254xp-3001.app.github.dev/api/analyze_apartments";
      console.log("Preparing request to:", url);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ preferences })
      };

      console.log("Request options:", requestOptions);

      console.log("Sending request...");
      const response = await fetch(url, requestOptions);

      console.log("Response received. Status:", response.status);
      console.log("Response status text:", response.statusText);
      console.log("Response headers:", JSON.stringify([...response.headers]));

      const contentType = response.headers.get("content-type");
      console.log("Response content-type:", contentType);

      let responseBody;
      if (contentType && contentType.includes("application/json")) {
        responseBody = await response.json();
        console.log("Response JSON body:", responseBody);
      } else {
        responseBody = await response.text();
        console.log("Response text body:", responseBody);
      }

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}, response text: ${responseBody}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Setting response data...");
      setResponse(responseBody);
    } catch (error) {
      console.error("Error caught in handleSubmit:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
    } finally {
      console.log("Finalizing handleSubmit");
      setLoading(false);
    }
  };

  const parsePreferences = (input) => {
    const preferences = {};
    const locationMatch = input.match(/in (\w+(?:,?\s*\w+)*)/i);
    const homeTypeMatch = input.match(/(apartment|house|condo|townhouse)/i);
    const bedroomsMatch = input.match(/(\d+)\s*bedrooms?/i);
    const bathroomsMatch = input.match(/(\d+)\s*bathrooms?/i);
    const priceMatch = input.match(/(\d{1,3}(?:,\d{3})*)\s*to\s*(\d{1,3}(?:,\d{3})*)\s*(?:dollars|usd|$)/i);
    const lessThanPriceMatch = input.match(/less\s*than\s*(\d{1,3}(?:,\d{3})*)\s*(?:dollars|usd|$)/i);
    const moreThanPriceMatch = input.match(/more\s*than\s*(\d{1,3}(?:,\d{3})*)\s*(?:dollars|usd|$)/i);
  
    // Updated square feet matching
    const squareFeetMatch = input.match(/(\d+)\s*(?:sq(?:uare)?\s*f(?:ee)?t|sqft)/i);
    const lessThanSqftMatch = input.match(/less\s*than\s*(\d+)\s*(?:sq(?:uare)?\s*f(?:ee)?t|sqft)/i);
    const moreThanSqftMatch = input.match(/more\s*than\s*(\d+)\s*(?:sq(?:uare)?\s*f(?:ee)?t|sqft)/i);
  
    if (locationMatch) preferences.location = locationMatch[1];
    if (homeTypeMatch) preferences.home_type = homeTypeMatch[1].charAt(0).toUpperCase() + homeTypeMatch[1].slice(1);
    if (bedroomsMatch) preferences.bedrooms = parseInt(bedroomsMatch[1], 10);
    if (bathroomsMatch) preferences.bathrooms = parseInt(bathroomsMatch[1], 10);
  
    // Handle price preferences
    if (priceMatch) {
      preferences.min_price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      preferences.max_price = parseInt(priceMatch[2].replace(/,/g, ''), 10);
    } else if (lessThanPriceMatch) {
      preferences.max_price = parseInt(lessThanPriceMatch[1].replace(/,/g, ''), 10);
    } else if (moreThanPriceMatch) {
      preferences.min_price = parseInt(moreThanPriceMatch[1].replace(/,/g, ''), 10);
    } else if (input.includes('less') || input.includes('under') || input.includes('at most')) {
      preferences.max_price = parseInt(input.match(/(\d{1,3}(?:,\d{3})*)/)[1].replace(/,/g, ''), 10);
    } else if (input.includes('more') || input.includes('over') || input.includes('at least')) {
      preferences.min_price = parseInt(input.match(/(\d{1,3}(?:,\d{3})*)/)[1].replace(/,/g, ''), 10);
    }
  
    // Handle square footage preferences
    if (lessThanSqftMatch) {
      preferences.max_sqft = parseInt(lessThanSqftMatch[1], 10);
    } else if (moreThanSqftMatch) {
      preferences.min_sqft = parseInt(moreThanSqftMatch[1], 10);
    } else if (squareFeetMatch) {
      const sqft = parseInt(squareFeetMatch[1], 10);
      if (input.includes('less') || input.includes('under') || input.includes('at most')) {
        preferences.max_sqft = sqft;
      } else if (input.includes('more') || input.includes('over') || input.includes('at least')) {
        preferences.min_sqft = sqft;
      } else {
        // If no qualifier is provided, set both min and max to the same value
        preferences.min_sqft = sqft;
        preferences.max_sqft = sqft;
      }
    }
  
    preferences.sort = "Newest";
  
    return Object.keys(preferences).length > 0 ? preferences : null;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Home Search</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <textarea
                className="form-control"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe your preferences (e.g., I want an apartment in San Diego)"
                rows="4"
                required
                disabled={loading}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search Homes'}
              </button>
            </div>
          </form>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {response && (
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Search Results:</h2>
                <div className="mb-4">
                  <h3 className="h5">Analysis:</h3>
                  <p>{response.analysis}</p>
                </div>
                <h3 className="h5">Apartments:</h3>
                {response.apartments.map((apartment, index) => (
                  <div key={index} className="mb-3">
                    <h4 className="h6">{apartment.address}</h4>
                    <p>
                      <strong>Price:</strong> ${apartment.price}
                    </p>
                    <p>
                      <strong>Bedrooms:</strong> {apartment.bedrooms}, <strong>Bathrooms:</strong> {apartment.bathrooms}
                    </p>
                    <p>
                      <strong>Living Area:</strong> {apartment.living_area} sqft
                    </p>
                    <p>
                      <strong>Home Type:</strong> {apartment.home_type}
                    </p>
                    {apartment.image_url && <img src={apartment.image_url} alt="Apartment" className="img-fluid mb-2" />}
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default HomeSearch;




//import React, { useState } from 'react';
// // import OpenAI from "openai";

// function HomeSearch() {
//     const [userPrompt, setUserPrompt] = useState('');
//     const [response, setResponse] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // console.log("handleSubmit called");

//         // console.log("Sending request with prompt:", userPrompt);

//         let response = await fetch("https://bug-free-train-r4pxjxgx5vp254xp-3001.app.github.dev/analyze_apartments", {
//             method: "POST",
//             body: JSON.stringify({
//                 user_prompt: userPrompt
//             }),
//             headers: {
//                 "Content-type": "HomeSearchlication/json",
//             }
//         });
//         let data = await response.json();

//         console.log("Received response:", data);

//         if (response.ok) {
//             const content = data.result
//             setResponse(content);
//         } else {
//             console.error("Error during API call:", data.error);
//             setResponse("An error occurred while processing your request.");
//         }

//         // if(data.error) {
//         //     console.error("Error during API call:", data.error);
//         // }
//         // else {
//         //     setResponse(data.result);
//         // }

//         // setResponse({ error: "An error occurred while processing your request." });
//     };

//     return (
//         <div className="container mt-5">
//         <div className="row justify-content-center">
//             <div className="col-md-8">
//                 <h1 className="mb-4">Home Search</h1>
//                 <form onSubmit={handleSubmit} className="mb-4">
//                     <div className="mb-3">
//                         <textarea
//                             className="form-control"
//                             value={userPrompt}
//                             onChange={(e) => setUserPrompt(e.target.value)}
//                             placeholder="Describe the home you're looking for..."
//                             rows="4"
//                         />
//                     </div>
//                     <div className="d-grid">
//                         <button type="submit" className="btn btn-primary">Search Homes</button>
//                     </div>
//                 </form>
//                 {response && (
//                     <div className="card">
//                         <div className="card-body">
//                             <h2 className="card-title">Search Results:</h2>
//                             {Array.isArray(response) ? (
//                                 response.map((home, index) => (
//                                     <div key={index} className="mb-3">
//                                         <h3 className="h5">{home.address || `Home ${index + 1}`}</h3>
//                                         <p>{home.description}</p>
//                                         <p><strong>Price:</strong> ${home.price}</p>
//                                         <hr />
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>{response}</p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
// );
// }

// export default HomeSearch



/////////\



// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setLoading(true);
//   setError(null);

//   try {
//     const preferences = parsePreferences(userPrompt);
//     if (!preferences) {
//       throw new Error('Could not parse input. Please describe your preferences clearly.');
//     }

//     const response = await fetch("https://bug-free-train-r4pxjgx5vp254xp-3001.app.github.dev/api/analyze_apartments", {
//       method: "POST",
//       body: JSON.stringify(preferences),
//       headers: {
//         "Content-type": "application/json"
//       }
//     });

//     const data = await response.json();
//     console.log("Received response:", data);

//     if (response.ok) {
//       setResponse(data);
//     } else {
//       setError(data.message || 'Something went wrong');
//     }
//   } catch (e) {
//     setError(e.message);
//   } finally {
//     setLoading(false);
//   }
// };
