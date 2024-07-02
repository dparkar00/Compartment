import React, { useState } from 'react';
import axios from 'axios';
// import OpenAI from "openai";

function App() {
    const [userPrompt, setUserPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("handleSubmit called");

        // console.log("Sending request with prompt:", userPrompt);

        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": "Say this is a test!" }],
                "temperature": 0.7
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        let data = await response.json();

        console.log("Received response:", data);

        if(data.error) {
            console.error("Error during API call:", data.error);
        }
        else {
            setResponse(data.result);
        }

        // setResponse({ error: "An error occurred while processing your request." });
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