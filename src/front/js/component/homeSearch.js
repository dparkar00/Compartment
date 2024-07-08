import React, { useState } from 'react';

function HomeSearch() {
    const [userPrompt, setUserPrompt] = useState('');
    const [location, setLocation] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let response = await fetch("https://bug-free-train-r4pxjxgx5vp254xp-3001.app.github.dev/analyze_apartments", {
            method: "POST",
            body: JSON.stringify({
                preferences: userPrompt,
                location: location
            }),
            headers: {
                "Content-type": "application/json",
            }
        });
        let data = await response.json();

        console.log("Received response:", data);

        if (response.ok) {
            setResponse(data);
        } else {
            setError(data.error || "An error occurred while processing your request.");
        }

        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="mb-4">Home Search</h1>
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter location (e.g., San Francisco, CA)"
                                required
                            />
                            <textarea
                                className="form-control"
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder="Describe your preferences (e.g., budget, number of bedrooms, amenities)"
                                rows="4"
                                required
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
                                        <h4 className="h6">{apartment.address.line}, {apartment.address.city}, {apartment.address.state} {apartment.address.postal_code}</h4>
                                        <p><strong>Price:</strong> ${apartment.price}</p>
                                        <p><strong>Bedrooms:</strong> {apartment.bedrooms}, <strong>Bathrooms:</strong> {apartment.bathrooms}</p>
                                        <p><strong>Square Feet:</strong> {apartment.square_feet}</p>
                                        {apartment.photo_url && <img src={apartment.photo_url} alt="Apartment" className="img-fluid mb-2" />}
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