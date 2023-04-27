import logo from './logo.svg';
import './App.css';
import LetterInput from './LetterInput';
import { useState } from 'react';
import PhraseDisplay from './PhraseDisplay';
import ShareLink from './ShareLink';

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
  const [gameAnswer, setGameAnswer] = useState('');
  var customWord = false;
  var gameHint = '';
  const userDataEndpoint = 'https://lighthall-challenge-3.onrender.com';
  //check if the current URL contains an ID for a pre-made word
  const path = window.location.pathname;
  if (path.includes('/word')) {
    //GET request to endpoint, on success set the word for gameAnswer
    customWord = true;
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
      })
      .catch((err) => {
        console.log('error in obtaining Word from user link')
        console.log(err);
      })
    })
  }

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
  if (!customWord) {
    var randomInt = Math.floor(Math.random() * defaultValues.length);
    setGameAnswer(defaultValues[randomInt].word.toUpperCase());
  }
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
      <ShareLink />
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
