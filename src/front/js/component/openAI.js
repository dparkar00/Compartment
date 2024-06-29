import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [userPrompt, setUserPrompt] = useState('');
    const [response, setResponse] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit called");
    
        try {
            console.log("Sending request with prompt:", userPrompt);
            const response = await axios.post('http://127.0.0.1:5000/chatgpt/ask', { user_prompt: userPrompt });
            console.log("Received response:", response.data);
    
            setResponse(response.data.result);
        } catch (error) {
            console.error("Error during API call:", error);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error message:", error.message);
            }
    
            setResponse({ error: "An error occurred while processing your request." });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Enter your prompt here"
                />
                <button type="submit">Submit</button>
            </form>
            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}

export default App