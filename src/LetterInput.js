import './letterInput.css';

/*
Notes:
    * I originally thought that it would be better to use a text input element rather than an on-screen keyboard, mainly because I thought that it would be easier to support additional languages.
    I now think that it might be better to create a different on-screen keyboard according to the user's device language
    (of course, I assume that for the challenge we only need to support English)
Notes II:
    * I decided that it might be kind of a hassle for users to press the submit button after selecting a letter,
    and since this is only a game, preventing the consequences of someone pressing the wrong letter on accident
    should be minimal. So, I have removed the confirmation step for guessing a letter.
*/

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

export default function LetterInput({guessesMade, onLetterSelected}) {
    return(
        <div className="letter-input">
            {/* <HeaderBar selectedLetter={selectedLetter}/> */}
            <h2>Choose a Letter:</h2>
            <KeyBoard onLetterSelected={onLetterSelected} guessesMade={guessesMade}/>
        </div>
    )
}