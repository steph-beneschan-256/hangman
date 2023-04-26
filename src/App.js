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

  const [gameInProgress, setGameInProgress] = useState(false);

  const [gameAnswer, setGameAnswer] = useState(""); //hardcoding value for testing purposes
  const [unrevealedLetters, setUnrevealedLetters] = useState(new Set());
    
  // All characters/letters that the user has already guessed, whether or not they are part of the solution phrase
  const [charsGuessed, setCharsGuessed] = useState(new Set());
  // How many incorrect letters the user has guessed
  const [penalties, setPenalties] = useState(0);
  
  // How many penalties the player can make before losing the game (TODO: find reasonable number)
  const maxPenalties = 5;

    /*
    what's the most efficient way to store the user's progress?
    maybe make some sort of index map with the letters in the answer?
    */

    function newGame(newAnswer) {
      const answer = newAnswer.toUpperCase();
      setGameAnswer(answer);
      setUnrevealedLetters(new Set(new Array(...answer).filter(char => !isSpecialChar(char))));
      setCharsGuessed(new Set());
      setPenalties(0);

      setGameInProgress(true);
    }

  function onGuessSubmitted(guessedChar) {
    if(unrevealedLetters.has(guessedChar)) {
      // remove guessedChar from unrevealedLetters
      let newSet = new Set(unrevealedLetters);
      newSet.delete(guessedChar);
      setUnrevealedLetters(newSet);
      // Check if the user has won the game, i.e. no more letters need to be revealed 
      if(newSet.size <= 0) {
        console.log("--- You won! ---");
        setGameInProgress(false); // the game has concluded
      }
    }
    else {
      //inflict penalty
      const p = penalties + 1;
      setPenalties(p);
      if(p > maxPenalties) {
        console.log("--- Try Again ---");
        setGameInProgress(false);
      }
      // TODO: check whether the user has lost the game
    }

    // add guessedChar to charsGuessed
    let newCharsGuessed = new Set(charsGuessed);
    //new Set(); charsGuessed.forEach(char => newCharsGuessed.add(char));
    newCharsGuessed.add(guessedChar);
    setCharsGuessed(newCharsGuessed);
  }

  function newGameButtonClicked() {
    const newAnswer = "giant anteater"; //for now, hardcode the value
    newGame(newAnswer);
  }

  return (
    <div className="App">
      <PhraseDisplay answer={gameAnswer} unrevealedLetters={unrevealedLetters} isSpecialChar={isSpecialChar} isGameFinished={!gameInProgress}/>
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
        {gameInProgress ? 
        (<LetterInput isValidLetter={isLetter} guessedLetters={charsGuessed} onGuessSubmitted={onGuessSubmitted}/>)
        :
        (<button onClick={newGameButtonClicked}>New Game</button>)}
      </div>
    </div>
      
  );
}

export default App;
