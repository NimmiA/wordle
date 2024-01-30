import React, { useState, useEffect } from 'react';
import '../styles/wordle.css'; // Import your CSS file for styling
import InputKeypad from './InputKeypad';

const WordleGame = () => {
    const [attempts, setAttempts] = useState(6);

    const setAttemptsdata = (data) => {
        setAttempts(data)

    }
    return (
        <div className="wordle-container">
            <div className="header">
                <h1>Wordle</h1>
                <p>Guess the word in {attempts} attempts or fewer</p>
            </div>
            <div>
                <InputKeypad setAttemptsValue={setAttemptsdata} />
            </div>
        </div>
    );
};

export default WordleGame;