import logo from './logo.svg';
import './App.css';
import LetterInput from './LetterInput';
import { useState } from 'react';
import PhraseDisplay from './PhraseDisplay';

/*
Return a boolean indicating whether the character is a letter
*/
function isLetter(char) {
  return /^[A-Za-z]$/.test(char);
}

function isSpecialChar(char) {
  return !isLetter(char);
}


function App() {
  const gameAnswer = "giant anteater".toUpperCase(); //hardcoding value for testing purposes
  const [unrevealedLetters, setUnrevealedLetters] = useState(new Set(new Array(...gameAnswer).filter(char => !isSpecialChar(char))));
    
  // charsGuessed: All characters/letters that the user has already guessed, whether or not they are part of the solution phrase
  const [charsGuessed, setCharsGuessed] = useState(new Set());
  
  const [penalties, setPenalties] = useState(0); //placeholder penalty counter

    /*
    what's the most efficient way to store the user's progress?
    maybe make some sort of index map with the letters in the answer?
    */

  function onGuessSubmitted(guessedChar) {
    if(unrevealedLetters.has(guessedChar)) {
      // remove guessedChar from unrevealedLetters
      let newSet = new Set(unrevealedLetters);
      newSet.delete(guessedChar);
      setUnrevealedLetters(newSet);
      // Check if the user has won the game, i.e. no more letters need to be revealed 
      if(newSet.size <= 0) {
        console.log("--- You won! ---");
      }
    }
    else {
      //inflict penalty
      setPenalties(penalties + 1);
      // TODO: check whether the user has lost the game
    }

    // add guessedChar to charsGuessed
    let newCharsGuessed = new Set(charsGuessed);
    //new Set(); charsGuessed.forEach(char => newCharsGuessed.add(char));
    newCharsGuessed.add(guessedChar);
    setCharsGuessed(newCharsGuessed);
  }

  return (
    <div className="App">
      <PhraseDisplay answer={gameAnswer} unrevealedLetters={unrevealedLetters} isSpecialChar={isSpecialChar}/>
      <div>
        <h2>Guessed Letters:</h2>
        <div className="guessed-letters">
          {new Array(charsGuessed).map((letter) => {
            return(<div className="guessed-letter">{letter}</div>);
          })}
        </div>
        <div>
          Penalties: {penalties}
        </div>
        <LetterInput isValidLetter={isLetter} guessedLetters={charsGuessed} onGuessSubmitted={onGuessSubmitted}/>
      </div>
    </div>
      
  );
}

export default App;
