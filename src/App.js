import logo from "./logo.svg";
import "./App.css";
import LetterInput from "./LetterInput";
import { useState, useEffect, useRef } from "react";
import PhraseDisplay from "./PhraseDisplay";
import ShareLink from "./ShareLink";
import PenaltyCounter from "./PenaltyCounter";
import Leaderboard from "./Leaderboard";
import { gameStates } from "./GameStates";
import LoginBar from "./components/LoginBar/LoginBar";
import useLocalStorage from "./components/useLocalStorage/useLocalStorage";
import languageManager from "./languageManager";

function App() {
  var customWord = false;
  var gameHint = "";
  const path = window.location.pathname;
  const userDataEndpoint = "https://lighthall-challenge-3.onrender.com";
  var userId = "bc17195a-593e-4f6f-9457-7361566c4425"; //example for testing purposes, we need UI that allows users to sign in or create new

  const customWordLoaded = useRef(false);
  const leaderboardLoaded = useRef(false);

  const [showLeaderboard, setShowLeaderBoard] = useState(false);

  const [gameStatus, setGameStatus] = useState(gameStates.notStarted);

  const [leaderboardData, setLeaderboardData] = useState([]);

  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState(""); //using placeholder ID for testing
  const [userDataLS, setUserDataLS] = useLocalStorage(null, "userData");

  const [gamesWon, setGamesWon] = useState(0); // Games that the user has won;
  const [unloggedgamesWon, setunloggedGamesWon] = useLocalStorage(0, "gamesWon"); // Games that the user has won, before logging in

  useEffect(() => {
    //load the game answer
    //check if the current URL contains an ID for a pre-made word
    if (!customWordLoaded.current && path.includes("/word")) {
      //GET request to endpoint, on success set the word for gameAnswer
      customWordLoaded.current = true;
      setGameStatus(gameStates.loading);
      fetch(userDataEndpoint + path, {
        method: "GET",
        headers: {
          Accept: "application/json;charset=utf-8",
          "Content-Type": "application/json;charset=utf-8",
        },
      }).then((response) => {
        if (response.status === 404) {
          console.log("error in GET request, 404 error");
        }
        response
          .json()
          .then((a) => {
            console.log(a);
            setGameAnswer(a.word);
            newGame(a);
          })
          .catch((err) => {
            console.log("error in obtaining Word from user link");
            console.log(err);
          });
      });
    }

    if (!leaderboardLoaded.current) {
      fetch(`${userDataEndpoint}/leaderboard`, {
        method: "GET",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json; charset=utf-8",
        },
      }).then((response) => {
        if (response.status === 404) console.log("404 error");
        response.json().then((leaderboardData) => {
          setLeaderboardData(leaderboardData);
          leaderboardLoaded.current = true;
        });
      });
    }
  }, []);

  function handleKeyboardPress(e) {
    // do not prevent default behavior
    if(!e.ctrlKey) {
      const key = e.key.toUpperCase();
      submitGuess(key);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardPress);
    return () => {window.removeEventListener("keydown", handleKeyboardPress)};
  })

  const [gameAnswer, setGameAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [unrevealedLetters, setUnrevealedLetters] = useState(new Set());
  // How many incorrect letters the user has guessed
  const [penalties, setPenalties] = useState(0);
  // Store each character that the user has guessed, mapping it to a boolean indicating whether the guess was correct
  const [guessesMade, setGuessesMade] = useState(new Map());

  // How many penalties the player can make before losing the game (TODO: find reasonable number)
  const maxPenalties = 5;

  function incrementScore() {
    //make post request with userID
    fetch(`${userDataEndpoint}/leaderboard/${userID}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Connection: "keep-alive",
      },
    }).then((response) => {
      if (response.status === 500) {
        console.log("error in incrementing score, 500 error");
      }
      else if(response.status === 200) {
        console.log("score incremented")
      }
      else {
      response
        .json()
        .then((a) => {
          //reload leaderboard
          leaderboardLoaded.current = false;
        })
        .catch((err) => {
          console.log("error in incrementing score");
          console.log(err);
        });
      }
    });
  }

  function newGame(wordData) {
    console.log(wordData);
    const answer = wordData.word.toUpperCase();
    setGameAnswer(answer);
    setHint(wordData.hint);
    setUnrevealedLetters(
      new Set(new Array(...answer).filter((char) => !languageManager.isSpecialChar(char)))
    );
    setGuessesMade(new Map());
    setPenalties(0);

    setGameStatus(gameStates.inProgress);
  }

  function submitGuess(guessedChar) {
    if((gameStatus === gameStates.inProgress) && !guessesMade.has(guessedChar) && languageManager.isValidChar(guessedChar))
      onGuessSubmitted(guessedChar);
  }

  function onGuessSubmitted(guessedChar) {
    const guessWasCorrect = unrevealedLetters.has(guessedChar);

    if (guessWasCorrect) {
      // remove guessedChar from unrevealedLetters
      let newSet = new Set(unrevealedLetters);
      newSet.delete(guessedChar);
      setUnrevealedLetters(newSet);
      // Check if the user has won the game, i.e. no more letters need to be revealed
      if (newSet.size <= 0) {
        gameWon();
        setGameStatus(gameStates.won); // the game has concluded
      }
    } else {
      //inflict penalty
      const p = penalties + 1;
      setPenalties(p);
      // Check if user has lost the game
      if (p > maxPenalties) {
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
    if(userID) {
      setGamesWon(gamesWon + 1);
      incrementScore();
    }
    else
      setunloggedGamesWon(unloggedgamesWon + 1);
  }

  function gameLost() {
    console.log("--- Try Again ---");
  }

  function newGameButtonClicked() {
    newGame(languageManager.getRandomPhrase());
    //newGame({word: "thequickfoxjumpsoverthelazydog", hint: "debug word (30 letters)"})
  }

  function loggedIn(data) {
    setUserID(data["id"]);
    setUserName(data["name"]);
    setGamesWon(data["score"]);
    console.log(data);
    if(unloggedgamesWon > 0) {
      //TODO: Update leaderboard with games won before log-in
      console.log(`Games won before login: ${unloggedgamesWon}`);
      setunloggedGamesWon(0);
    }

  }

  function loggedOut() {
    setUserDataLS(null);
    setUserID("");
    setUserName("");
  }

  function gamesWonString() {
    const winCount = userID ? gamesWon : unloggedgamesWon;
    return `You've won a total of ${winCount} ${(winCount === 1) ? "game" : "games"}!`;
  }

  return (
    <div className="App">
      <div className="header">
        {userID ? (
          <>
            <div className="user-info">
              <span className="logged-in-as">Logged in as </span>
              <span className="user-name">{userName}</span>
            </div>
            <div className="logout-button-container">
              <button onClick={loggedOut}>Sign Out</button>
            </div>
          </>
        ):(
          <div className="login-bar-container">
            <div>Log in to join the leaderboard!</div>
            <LoginBar
              onLoggedIn={loggedIn}
              dataEndpoint={userDataEndpoint}
              setUserDataLS={setUserDataLS}
              userDataLS={userDataLS}
            />
          </div>
        )}
      </div>

      {true && (
        <>
          {gameStatus !== gameStates.notStarted && (
            <div className={"game-status-display"}>
              <PhraseDisplay
                answer={gameAnswer}
                unrevealedLetters={unrevealedLetters}
                gameStatus={gameStatus}
                hint={hint}
              />
              <PenaltyCounter
                penalties={penalties}
                maxPenalties={maxPenalties}
              />
            </div>
          )}

          {(gameStatus === gameStates.won) && (
            <>
              <div>
                YOU WON!
              </div>
              <div>
                {gamesWonString()}
              </div>
            </>
          )}
          {(gameStatus === gameStates.lost) && (
            <div>
              Better luck next time!
            </div>
          )}
    
      <div>
        {(gameStatus === gameStates.inProgress) ? 
        (<>
          <LetterInput guessesMade={guessesMade}
          onLetterSelected={submitGuess}/>
        </>)
        :
        (<div>
          <button onClick={newGameButtonClicked}>New Game</button>
          <button onClick={() => setShowLeaderBoard(true)}>Leaderboard</button>
          <ShareLink dataEndpoint={userDataEndpoint} />
        </div>)}
      </div>

      {showLeaderboard && <Leaderboard leaderboardData={leaderboardData} currentUserID={userID}
      onClose={() => setShowLeaderBoard(false)}/>}
        </>
      )}
    </div>
  );
}

export default App;
