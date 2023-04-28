import { gameStates } from "./GameStates";
import "./phraseDisplay.css";
import languageManager from "./languageManager";

/*
    We can think of three kinds of characters in the answer phrase:
    * Special characters (e.g. spaces and punctuation)
    * Letters that the user hasn't guessed yet
    * Letters that the user has already guessed
*/

export default function PhraseDisplay({answer, unrevealedLetters, gameStatus, hint}) {
    console.log('in phrase display with the gameanswer: ' + answer);

    const words = languageManager.getWords(answer);
    let maxWordLen = 0;
    words.forEach(word => {
        if(word.length > maxWordLen)
            maxWordLen = word.length;
    });
    const tileWidth = 75/maxWordLen;
    const tileHeight = tileWidth * 4/3;
    
    return(
        <div className="phrase-display">
            {words.map((word) => (
                //
                <div className="word">
                    {
                    new Array(...word).map((char) => {
                        let classes = "char-tile";
                        if(!languageManager.isSpecialChar(char)) {
                            classes += " letter-tile";
                            if(gameStatus === gameStates.won)
                                classes += " game-won";
                            else if((gameStatus === gameStates.lost) && unrevealedLetters.has(char))
                                classes += " game-lost";
                        }

                        return(
                            <div className={classes} style={{
                                "width": `${tileWidth}vw`,
                                "height": `${tileHeight}vw`, 
                                "fontSize": `min(${tileWidth}vw, 50px)`,
                                }}>
                                {((gameStatus === gameStates.inProgress) && unrevealedLetters.has(char)) ? "": char}
                            </div>
                        );
                    })
                    }
                </div>
            ))}
            <h3>Hint: {hint}</h3>
        </div>
    )
}