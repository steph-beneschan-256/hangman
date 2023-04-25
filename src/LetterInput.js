import { useState } from "react";

/*
Notes:
    * The idea is to create a text input element so that when the user wants to guess a letter, they can select the input element and type in the desired letter using their keyboard. I thought that this would be preferable to creating an on-screen keyboard (similar to Wordle's interface) because:
        - Mobile users can use their existing keyboard
        - It would be (at least theoretically) easier to add support for other languages
        - The component should take up less screen space
*/

function defaultLetterIsValid(letter) {
    const p = /^[A-Za-z]$/; 
    return p.test(letter);
}


/*
Props:
    * letterIsValid: function taking a single letter/character as input; returns boolean depending on whether the letter is valid (i.e. whether the user is able to guess that letter); has nothing to do with whether the letter is correct/part of the answer
        * (Would it be better to just use a RegEx pattern?)
    * guessedLetters: list of letters/characters that have already been guessed
    * onGuessSubmitted: function to be called when the user has submitted a guess
*/

export default function LetterInput({letterIsValid=defaultLetterIsValid, guessedLetters, onGuessSubmitted}) {
    const [inputLetter, setInputLetter] = useState('');
    const [canGuessLetter, setCanGuessLetter] = useState(false); // Whether the currently-input letter can be guessed
    const [errorMsg, setErrorMsg] = useState("");

    function submitGuess(guess=inputLetter) {
        console.log(`Already guessed letters: ${guessedLetters}`);
        console.log(guess);
        if(canGuessLetter) {
            setInputLetter(''); //reset input letter in box
            onGuessSubmitted(guess);
            console.log(`Guessed ${guess}`);
        }   
    }

    function inputLetterChanged(newLetter) {
        //
        if(!newLetter) { // no letters entered
            setErrorMsg("");
            setCanGuessLetter(false);
        }
        else if(guessedLetters.indexOf(newLetter) !== -1) {
            //already guessed this letter
            setErrorMsg("Already guessed that letter.");
            setCanGuessLetter(false);
        }   
        else if(!letterIsValid(newLetter)) {
            setErrorMsg("Invalid letter.");
            setCanGuessLetter(false);
        }
        else {
            setErrorMsg("");
            setCanGuessLetter(true);
        }
    }

    return(
        <div className="letter-input">
            <form onSubmit={(e) => {
                e.preventDefault();
                submitGuess()}}>
            <label>
                Guess a letter:
                <input type="text" value={inputLetter} maxLength={1}
                className="input-text"
                onChange={(e) => {
                    const newLetter = e.target.value.toUpperCase();
                    console.log(newLetter);
                    // If the new letter is whitespace, ignore it
                    // Note: using \S causes the backspace key to be ignored
                    if(!/\s/.test(newLetter)) {
                        setInputLetter(newLetter);
                        inputLetterChanged(newLetter);
                    }
                }}
                />
            </label>
            <div>
                <input type="submit" value="Submit Guess"
                disabled={!canGuessLetter}
                className="input-submit"/>
            </div>
            <div className="error-msg">
                {errorMsg && (
                    /* TODO: maybe add some kind of caution symbol*/
                    <div>{errorMsg}</div>
                )}
            </div>
            </form>
        </div>
    )
}