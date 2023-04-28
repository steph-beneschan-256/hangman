import { gameStates } from "./GameStates";
import "./phraseDisplay.css";

/*
    We can think of three kinds of characters in the answer phrase:
    * Special characters (e.g. spaces and punctuation)
    * Letters that the user hasn't guessed yet
    * Letters that the user has already guessed
*/

export default function PhraseDisplay({answer, unrevealedLetters, isSpecialChar, gameStatus, hint}) {
    console.log('in phrase display with the gameanswer: ' + answer);

    function getWords(str) {
        /*
        Split answer into words
        */
        //split answer into words
        //if special chars. are present, append first one to end of first word
        // for now, hardcode spec. char. regex string
        const words = answer.split(/ |(?<=[A-Za-z][^A-Za-z]+)\b/);
        return words;

        //TODO: 
        //const maxWordLen = words.length;
        //const 

        /*
        all letter tiles should be the same size
        each word needs to fit on one line
        */
    }

    const words = getWords(answer);

    let maxWordLen = 0;
    words.forEach(word => {
        if(word.length > maxWordLen)
            maxWordLen = word.length;
    });
    const tileWidth = 75/maxWordLen;
    const tileHeight = tileWidth * 4/3;
    
    return(
        <div className="phrase-display">
            {getWords(answer).map((word) => (
                //
                <div className="word">
                    {
                    new Array(...word).map((char) => {
                        let classes = "char-tile";
                        if(!isSpecialChar(char)) {
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
                                "font-size": `min(${tileWidth}vw, 50px)`,
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