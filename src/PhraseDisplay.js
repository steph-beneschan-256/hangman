
/*
    We can think of three kinds of characters in the answer phrase:
    * Special characters (e.g. spaces and punctuation)
    * Letters that the user hasn't guessed yet
    * Letters that the user has already guessed
*/

export default function PhraseDisplay({answer, unrevealedLetters, isSpecialChar, isGameFinished}) {
    
    return(
        <div>
            {new Array(...answer).map((char) => {
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
            })}
        </div>
    )
}