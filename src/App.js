import logo from './logo.svg';
import './App.css';
import LetterInput from './LetterInput';
import { useState } from 'react';



function App() {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [temp, setTemp] = useState("");

  function onGuessSubmitted(guess) {
    setTemp(guess);
    
    const newGuessedLetters = (guessedLetters ? guessedLetters : []);
    newGuessedLetters.push(guess);
    setGuessedLetters(newGuessedLetters);
    console.log(newGuessedLetters);
  }

  return (
    <div className="App">
      <header>
      </header>

      <body>
        <h2>Guessed Letters:</h2>
        <div className="guessed-letters">
          {guessedLetters.map((letter) => (
            <span className="guessed-letter">
              {letter}
            </span>))}
        </div>
        <LetterInput guessedLetters={guessedLetters} onGuessSubmitted={onGuessSubmitted}/>
      </body>
    </div>
      
  );
}

export default App;
