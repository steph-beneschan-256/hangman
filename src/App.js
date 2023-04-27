import logo from './logo.svg';
import './App.css';
import LetterInput from './LetterInput';
import { useState } from 'react';
import PhraseDisplay from './PhraseDisplay';

const dataEndpoint = "https://lighthall-task-app.onrender.com";

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
  // How many incorrect letters the user has guessed
  const [penalties, setPenalties] = useState(0);
  // Store each character that the user has guessed, mapping it to a boolean indicating whether the guess was correct
  const [guessesMade, setGuessesMade] = useState(new Map());
  
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
      setGuessesMade(new Map());
      setPenalties(0);

      setGameInProgress(true);
    }

  function onGuessSubmitted(guessedChar) {
    const guessWasCorrect = unrevealedLetters.has(guessedChar);

    if(guessWasCorrect) {
      // remove guessedChar from unrevealedLetters
      let newSet = new Set(unrevealedLetters);
      newSet.delete(guessedChar);
      setUnrevealedLetters(newSet);
      // Check if the user has won the game, i.e. no more letters need to be revealed 
      if(newSet.size <= 0) {
        gameWon();
        setGameInProgress(false); // the game has concluded
      }
    }
    else {
      //inflict penalty
      const p = penalties + 1;
      setPenalties(p);
      // Check if user has lost the game
      if(p > maxPenalties) {
        gameLost();
        setGameInProgress(false);
      }
    }

    // update guess map
    const m = new Map(guessesMade);
    m.set(guessedChar, guessWasCorrect);
    setGuessesMade(m);
  }

  function gameWon() {
    console.log("--- You won! ---");
    //TODO: send post request to backend
    try {
      fetch(`${dataEndpoint}/leaderboard`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: "placeholder",
          wordID: "placeholder"
        })
      }).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  catch (NetworkError) {
    console.log("ow");
  }

  }

  function gameLost() {
    console.log("--- Try Again ---");
    //TODO: update leaderboard?
  }

  function newGameButtonClicked() {
    const newAnswer = "giant anteater"; //for now, hardcode the value
    newGame(newAnswer);
  }

  return (
    <div className="App">
      <PhraseDisplay answer={gameAnswer} unrevealedLetters={unrevealedLetters} isSpecialChar={isSpecialChar} isGameFinished={!gameInProgress}/>
      <div>
        {/* <h2>Guessed Letters:</h2>
        <div className="guessed-letters">
          {new Array(guessesMade.keys()).map((letter) => {
            return(<div className="guessed-letter">{letter}</div>);
          })}
        </div> */}
        <div>
          Penalties: {penalties}
        </div>
        {gameInProgress ? 
        (<LetterInput isValidLetter={isLetter} guessesMade={guessesMade} onGuessSubmitted={onGuessSubmitted}/>)
        :
        (<button onClick={newGameButtonClicked}>New Game</button>)}
      </div>
    </div>
      
  );
}

export default App;
