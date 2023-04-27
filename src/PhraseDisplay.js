import "./phraseDisplay.css";

/*
    We can think of three kinds of characters in the answer phrase:
    * Special characters (e.g. spaces and punctuation)
    * Letters that the user hasn't guessed yet
    * Letters that the user has already guessed
*/

export default function PhraseDisplay({answer, unrevealedLetters, isSpecialChar, isGameFinished}) {
    console.log('in phrase display with the gameanswer: ' + answer);

    function getWords(str) {
        /*
        Split answer into words
        */
        //split answer into words
        //if special chars. are present, append first one to end of first word
        // for now, hardcode spec. char. regex string
        return answer.split(/ |(?<=[A-Za-z][^A-Za-z]+)\b/);
    }
    
    return(
        <div className="phrase-display">
            {getWords(answer).map((word) => (
                //
                <div className="word">
                    {
                    new Array(...word).map((char) => {
                        if(isSpecialChar(char)) {
                            return (<div className="char-tile">{char}</div>);
                        }
                        if(isGameFinished) {
                            return(
                                <div className={"char-tile letter-tile " + (unrevealedLetters.has(char) ? "game-lost" : "")}>
                                    {char}
                                </div>
                            )
                        }
                        return(
                            <div className={"char-tile letter-tile"}>
                                {unrevealedLetters.has(char) ? "" : char}
                            </div>
                        )
                    })
                    }
                </div>
            ))}
        </div>
    )
}