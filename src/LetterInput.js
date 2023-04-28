import './letterInput.css';
import languageManager from './languageManager';

/*
On-screen keyboard, similar to the one seen in the game Wordle
Letters are highlighted depending on whether they were already guessed and, if so, whether the guess was correct

*/
function KeyBoard({onLetterSelected, guessesMade}) {

    function getSecondaryClass(letter) {
        if(guessesMade.has(letter))
            return guessesMade.get(letter) ? "correct-letter" : "incorrect-letter";
        return "";
    } 
    return(
        <div>
            {languageManager.getKeyboardRows().map(row => (
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

export default function LetterInput({guessesMade, onLetterSelected}) {
    return(
        <div className="letter-input">
            <h2>Choose a Letter:</h2>
            <KeyBoard onLetterSelected={onLetterSelected} guessesMade={guessesMade}/>
        </div>
    )
}