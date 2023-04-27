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


        //TODO: 
        //const maxWordLen = words.length;
        //const 

        /*
        all letter tiles should be the same size
        each word needs to fit on one line
        */
    }
    
    return(
        <div className="phrase-display">
            {getWords(answer).map((word) => (
                //
                <div className="word">
                    {
                    new Array(...word).map((char) => {

                        const secondaryClass = isSpecialChar(char) ? "" : "letter-tile";
                        const tertiaryClass = (isGameFinished && unrevealedLetters.has(char)) ? "game-lost" : "";
                        return(
                            <div className={`char-tile ${secondaryClass} ${tertiaryClass}`}
                            style={{"width": ""}}>
                                {unrevealedLetters.has(char) ? "": char}
                            </div>
                        );
                    })
                    }
                </div>
            ))}
        </div>
    )
}