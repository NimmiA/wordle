import React, { useEffect, useState } from 'react'
import '../styles/wordle.css'; // Import your CSS file for styling
import { API_URL } from "../constants/Constants"
import { validateApi } from "../API/Api"


export default function InputKeypad(props) {
    const [letters, setLetters] = useState(null)
    const [wordleWord, setWordleWord] = useState('');
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(6);
    const [feedback, setFeedback] = useState([]);
    const [shuffledKeys, setShuffledKeys] = useState([]);
    const [final, setFinal] = useState(false)

    useEffect(() => {
        fetchWordleWord();
        shuffleKeys();
    }, []);

    const shuffleKeys = () => {
        const keys = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
        const shuffled = keys.sort(() => Math.random() - 1);
        setShuffledKeys(shuffled);
    };

    const handleKeyPress = (key) => {
        if (key === 'Enter') {
            handleGuess();
        } else if (/^[a-zA-Z]$/.test(key)) {
            setGuess((prevGuess) => prevGuess ? prevGuess + key.toUpperCase() : key.toUpperCase());
        }
    };

    const updateFeedback = (score) => {
        setFeedback(score.map((s, index) => (s === 2 ? 'correct' : s === 1 ? 'close' : 'incorrect')));
    };

    const fetchWordleWord = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.isValidWord) {
                setWordleWord(data.word.toLowerCase());
                setFeedback(Array(data.word.length).fill(''));
            } else {
                console.error('Invalid word received from API.');
            }
        } catch (error) {
            console.error('Error fetching word from API:', error.message);
        }
    };

    const handleGuess = async () => {
        try {
            const data = await validateApi(guess)
            updateFeedback(data.score);
            if (data.isValidWord && !data.score.includes(1)) {
                // All characters are correctly guessed
                alert('Congratulations! You guessed the word correctly.');
                fetchWordleWord();
                setAttempts(6);
                shuffleKeys();
            } else {
                setAttempts(attempts - 1);
                props.setAttemptsValue(attempts - 1)
                if (attempts === 1) {
                    // No more attempts left
                    // alert(`Sorry! You've run out of attempts. The correct word was "${wordleWord}".`);
                    setFinal(true)
                    fetchWordleWord();
                    setAttempts(6);
                    props.setAttemptsValue(6)
                    shuffleKeys();
                }
            }


        } catch (error) {
            console.error('Error validating guess:', error.message);
        }
    };

    //clearing feedback and guess for the next try
    const clearPreviousGuess = () => {
        setFeedback([])
        setGuess()
    }

    return (
        <div disabled={final}>
            <div className="keypad">
                {shuffledKeys.map((key, index) => (
                    <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        className={`key-button ${feedback[index]}`}
                    >
                        {
                            feedback[index] === 'correct' || feedback[index] === 'close' ?
                                guess[index]
                                :
                                key
                        }
                    </button>
                ))}

            </div>
            <div className="action-container"><button onClick={() => handleKeyPress('Enter')} className="action-button">
                Try Your Luck
            </button>
                <button onClick={() => clearPreviousGuess()} className="action-button">
                    Try Again
                </button>

            </div><p>Click try again for your next attempt</p>
        </div>

    )
}