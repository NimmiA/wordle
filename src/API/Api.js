import {API_URL} from "../constants/Constants"


export const validateApi =async(guess)=>{
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            guess: guess.toUpperCase(), // Convert guess to uppercase as API is case-insensitive
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to validate guess.');
    }

    const data = await response.json();
    return data
}

