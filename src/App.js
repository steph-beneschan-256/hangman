import logo from './logo.svg';
import './App.css';
import LetterInput from './LetterInput';
import { useState, useEffect, useRef } from 'react';
import PhraseDisplay from './PhraseDisplay';
import ShareLink from './ShareLink';
import PenaltyCounter from './PenaltyCounter';

/*
Return a boolean indicating whether the character is a letter
*/
function isLetter(char) {
  return /^[A-Za-z]$/.test(char);
}

function isSpecialChar(char) {
  return !isLetter(char);
}

const gameStates = {
  "notStarted": 0,
  "inProgress": 1,
  "won": 2,
  "lost": 3,
  "loading": 4
}


function App() {
  var customWord = false;
  var gameHint = '';
  const path = window.location.pathname;
  const userDataEndpoint = 'https://lighthall-challenge-3.onrender.com';
  var userId = 'bc17195a-593e-4f6f-9457-7361566c4425' //example for testing purposes, we need UI that allows users to sign in or create new

  const customWordLoaded = useRef(false);

  const [gameStatus, setGameStatus] = useState(gameStates.notStarted);

  useEffect(()=> {
    //load the game answer
    //check if the current URL contains an ID for a pre-made word
    if ((!customWordLoaded.current) && path.includes('/word')) {
      //GET request to endpoint, on success set the word for gameAnswer
      customWordLoaded.current = true;
      setGameStatus(gameStates.loading);
      fetch(userDataEndpoint + path, {
        method: "GET",
        headers: {
          'Accept': 'application/json;charset=utf-8',
          'Content-Type': 'application/json;charset=utf-8'
      }
      }).then((response) => {
        if (response.status === 404) {
          console.log('error in GET request, 404 error')
        }
        response.json().then(a => {
          console.log(a);
          setGameAnswer(a.word);
          gameHint = a.hint;
          newGame(a);
        })
        .catch((err) => {
          console.log('error in obtaining Word from user link')
          console.log(err);
        })
      })
    }
  }, [])

  const [gameAnswer, setGameAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [unrevealedLetters, setUnrevealedLetters] = useState(new Set());
  // How many incorrect letters the user has guessed
  const [penalties, setPenalties] = useState(0);
  // Store each character that the user has guessed, mapping it to a boolean indicating whether the guess was correct
  const [guessesMade, setGuessesMade] = useState(new Map());

  // How many penalties the player can make before losing the game (TODO: find reasonable number)
  const maxPenalties = 5;

  function getRandomWord() {
    const defaultValues = [
      {word: 'hairy rabbit', hint:'animal'},
      {word: 'grey fox', hint:'animal'},
      {word: 'big whale', hint:'animal'},
      {word: 'orange goldfish', hint:'animal'},
      {word: 'bald eagle', hint:'animal'},
      {word: 'buttered toast', hint:'food'},
      {word: 'bag of fries', hint:'food'},
      {word: 'chocolate cake', hint:'food'},
      {word: 'three spoiled apples', hint:'food'},
      {word: 'seedless watermelon', hint:'food'},
      {word: 'kayaking through waterfall', hint:'sport'},
      {word: 'football', hint:'sport'},
      {word: 'underwater basket weaving', hint:'sport'},
      {word: 'major league baseball', hint:'sport'},
      {word: 'minor leage basketball', hint:'sport'},
      {word: 'the matrix', hint:'movie'},
      {word: 'the last of the mohicans', hint:'movie'},
      {word: 'goodfellas', hint:'movie'},
      {word: 'star wars', hint:'movie'},
      {word: 'john wick', hint:'movie'}
    ];
    //use default word and hint if URL does not specify custom made word
    var randomInt = Math.floor(Math.random() * defaultValues.length);
    return defaultValues[randomInt];
  }

  function incrementScore() {
    //make post request with userID
    fetch(`${userDataEndpoint}/leaderboard/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Connection: "keep-alive",
      }
    }).then((response) => {
      if (response.status === 500) {
        console.log('error in incrementing score, 500 error')
      }
      response.json().then(a => {
      })
      .catch((err) => {
        console.log('error in incrementing score')
        console.log(err);
      })
    });
  }

  function newGame(wordData) {
    console.log(wordData);
    const answer = wordData.word.toUpperCase();
    setGameAnswer(answer);
    setHint(wordData.hint);
    setUnrevealedLetters(new Set(new Array(...answer).filter(char => !isSpecialChar(char))));
    setGuessesMade(new Map());
    setPenalties(0);

    setGameStatus(gameStates.inProgress);
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
        setGameStatus(gameStates.won); // the game has concluded
      }
    }
    else {
      //inflict penalty
      const p = penalties + 1;
      setPenalties(p);
      // Check if user has lost the game
      if(p > maxPenalties) {
        gameLost();
        setGameStatus(gameStates.lost);
      }
    }

    // update guess map
    const m = new Map(guessesMade);
    m.set(guessedChar, guessWasCorrect);
    setGuessesMade(m);
  }

  function gameWon() {
    console.log("--- You won! ---");
    incrementScore();
  }

  function gameLost() {
    console.log("--- Try Again ---");
    //TODO: update leaderboard?
  }

  function newGameButtonClicked() {
    newGame(getRandomWord());
  }

  return (
    <div className="App">
      <ShareLink dataEndpoint={userDataEndpoint}/>
      {(gameStatus !== gameStates.notStarted) &&
      (
        <div className={"game-status-display"}>
          <PhraseDisplay answer={gameAnswer} unrevealedLetters={unrevealedLetters}
          isSpecialChar={isSpecialChar} isGameFinished={(gameStatus !== gameStates.inProgress)}/>
          <h3>Hint: {hint}</h3>
          <PenaltyCounter penalties={penalties} maxPenalties={maxPenalties}/>
        </div>
      )}

      <div>
        {(gameStatus === gameStates.inProgress) ? 
        (<>
          <LetterInput isValidLetter={isLetter} guessesMade={guessesMade}
          onGuessSubmitted={onGuessSubmitted}/>
        </>)
        :
        (<button onClick={newGameButtonClicked}>New Game</button>)}
      </div>
    </div>

  );
}

export default App;
