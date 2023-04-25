import logo from './logo.svg';
import './App.css';
import LetterInput from './LetterInput';
import { useState } from 'react';
import PhraseDisplay from './PhraseDisplay';

// placeholder?
function isValidLetter(letter) {
  return /^[A-Za-z]$/.test(letter);
}


function App() {
  const gameAnswer = "giant anteater".toUpperCase(); //hardcoding value for testing purposes
  
  // Get the set of unique letters in the answer phrase, excluding special characters (e.g. punctuation)
  const [answerChars, setAnswerChars] = useState(new Set(new Array(...gameAnswer).filter(char => isValidLetter(char))));
  console.log(new Set(new Array(...gameAnswer).filter(char => isValidLetter(char))))
  const [charsGuessed, setCharsGuessed] = useState(new Set());

    /*
    what's the most efficient way to store the user's progress?
    maybe make some sort of index map with the letters in the answer?
    */

  function onGuessSubmitted(guessChar) {
    if(answerChars.has(guessChar)) {
      //TODO: check whether the user has won the game
    }
    else {
      //TODO: inflict penalty
    }

    /*
    Note: encountered a bug (?) where the App component won't re-render
    if the array is mutated rather than being replaced by a new array
    */
    let newCharsGuessed = new Set();
    charsGuessed.forEach(char => newCharsGuessed.add(char));
    newCharsGuessed.add(guessChar);
    setCharsGuessed(newCharsGuessed);
  }

  return (
    <div className="App">
      <PhraseDisplay answer={gameAnswer} answerChars={answerChars} charsGuessed={charsGuessed}/>
      <div>
        <h2>Guessed Letters:</h2>
        <div className="guessed-letters">
          {new Array(charsGuessed).map((letter) => {
            return(<span>{letter}</span>);
          })}
        </div>
        <LetterInput guessedLetters={charsGuessed} onGuessSubmitted={onGuessSubmitted}/>
      </div>
    </div>
      
  );
}

export default App;
