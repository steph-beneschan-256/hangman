
function CharTile({character, isValidCharacter}) {
    return(
    <div className={"char-tile" + (character ? " letter-tile" : "")}>
        {character ? character : '?'}
    </div>)

}

/*
    We can think of three kinds of characters in the answer phrase:
    * Special characters (e.g. spaces and punctuation)
    * Letters that the user hasn't guessed yet
    * Letters that the user has already guessed
*/

const e = ["specialChar", "revealed", "blank"];

export default function PhraseDisplay({answer, answerChars, charsGuessed}) {
    console.log(answerChars);
    return(
        <div>
            {new Array(...answer).map((char) => {
                const secondaryClass = answerChars.has(char) ? "letter-tile" : "";
                return(
                    <div className={"char-tile " + secondaryClass}>
                        {(!answerChars.has(char)) || charsGuessed.has(char) ? char : ""}
                    </div>
                )
            })}
        </div>
    )
}