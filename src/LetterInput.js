import { useState } from "react";

/*
Notes:
    * I originally thought that it would be better to use a text input element rather than an on-screen keyboard, mainly because I thought that it would be easier to support additional languages.
    I now think that it might be better to create a different on-screen keyboard according to the user's device language
    (of course, I assume that for the challenge we only need to support English)
*/

/*
Default function for the letterIsValid prop of the LetterInput component (please see below)
*/
function defaultLetterIsValid(letter) {
    const p = /^[A-Za-z]$/; 
    return p.test(letter);
}

/*
Header that appears at the top of the LetterInput component; shows the currently selected letter and a "submit guess" button
*/
function HeaderBar({selectedLetter, onSubmit}) {

    return(
        <div className="letter-input-header">
            <div className="header-a">
                Choose a letter to guess:
            </div>
            <div className="header-b">
                {selectedLetter}
            </div>
            <div className="header-c">
                {selectedLetter &&
                <button onClick={onSubmit}>
                    Submit Guess
                </button>
                }
            </div>
        </div>
    )
}

/*
On-screen keyboard, similar to the one seen in the game Wordle
Letters are highlighted depending on whether they were already guessed and, if so, whether the guess was correct

*/
function KeyBoard({onLetterSelected, guessesMade}) {
    const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

    function getSecondaryClass(letter) {
        if(guessesMade.has(letter))
            return guessesMade.get(letter) ? "correct-letter" : "incorrect-letter";
        return "";
    } 
    return(
        <div>
            {keyboardRows.map(row => (
                <div className="keyboard-row">
                    {new Array(...row).map(letter => (
                        <button className={`keyboard-tile ${getSecondaryClass(letter)}`} 
                        disabled={guessesMade.has(letter)}
                        onClick={() => onLetterSelected(letter)}>
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

/*
Props:
    * letterIsValid: function taking a single letter/character as input; returns boolean depending on whether the letter is valid (i.e. whether the user is able to guess that letter); has nothing to do with whether the letter is correct/part of the answer
        * (Would it be better to just use a RegEx pattern?)
    * guessesMade: a Map object, mapping each letter that the user has guessed to a boolean indicating whether the guess was correct
    * onGuessSubmitted: function to be called when the user has submitted a guess
*/

export default function LetterInput({isValidLetter=defaultLetterIsValid, guessesMade, onGuessSubmitted}) {
    const [selectedLetter, setSelectedLetter] = useState('');
    const [errorMsg, setErrorMsg] = useState("");

    function submitGuess() {
        if(isValidLetter(selectedLetter)) {        
            onGuessSubmitted(selectedLetter);
            console.log(`Guessed ${selectedLetter}`);
            setSelectedLetter(''); //reset input letter in box
        }
    }

    function keyPressed(keyEvent) {
        keyEvent.preventDefault();
        const key = keyEvent.key.toUpperCase();
        switch(key) {
            case "ENTER":
                submitGuess();
                break;
            case "BACKSPACE":
                setSelectedLetter('');
                break;
            default:
                inputLetterChanged(key);
                break;
        }
    }

    function inputLetterChanged(newLetter) {
        if(isValidLetter(newLetter))
            setSelectedLetter(newLetter);
        else
            console.log(`Invalid letter entered: ${newLetter}`);
    }

    return(
        <div className="letter-input" onKeyDown={keyPressed}>
            <HeaderBar selectedLetter={selectedLetter} onSubmit={submitGuess}/>
            <KeyBoard onLetterSelected={inputLetterChanged} guessesMade={guessesMade}/>
        </div>
    )
}