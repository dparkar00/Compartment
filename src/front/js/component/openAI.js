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
                userId: 1,
                title: "fetch openai ",
                completed: false,
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": "Say this is a test!"}],
                "temperature": 0.7
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        let data = response.json();

        console.log("Received response:", data);

        console.error("Error during API call:", error);

        // if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.error("Response data:", error.response.data);
        //     console.error("Response status:", error.response.status);
        //     console.error("Response headers:", error.response.headers);
        // }
        // else {
            setResponse(data.result);
        // }

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