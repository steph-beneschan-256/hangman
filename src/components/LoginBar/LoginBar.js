import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

export default function LoginBar({
  onLoggedIn,
  dataEndpoint,
  setUserDataLS,
  userDataLS,
  onFocusIn,
  onFocusOut
}) {
  const [userName, setUserName] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  async function getUserData() {
    let response1 = await fetch(`${dataEndpoint}/user/${userName}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Connection: "keep-alive",
      },
    });

    if (response1["status"] === 200) {
      // User already exists
      const data = await response1.json().then((jsonData) => {
        const userID = jsonData["id"];
        const name = jsonData["name"];
        const score = jsonData["score"];
        return {id: userID, name: name, score: score};
      });
      return data;
    }
    else {
      // Must register user
      let response2 = await fetch(`${dataEndpoint}/user`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          user: {
            name: userName,
          },
        }),
      });

      if (response2["status"] === 201) {
        // New user created
        const responseData2 = await response2.json().then((jsonData) => {
          const userID = jsonData["id"];
          const name = jsonData["name"];
          const score = 0;
          return {id: userID, name: name, score: score};
        });
        return responseData2;
      }
    }
    return null;
  }

  async function logInButtonPressed() {
    if (userName !== "") {
      setIsLoadingLogin(true);
      const userData = await getUserData();
      console.log(userData);
      setIsLoadingLogin(false);
      if (userData) {
        onLoggedIn(userData);
        setUserDataLS(userName);
      } else {
        alert("Sorry, an error occurred while trying to log in.");
      }
    }
  }

  useEffect(() => {
    if (userDataLS && userDataLS !== "") {
      setUserName(userDataLS);
      if (userName !== "") {
        getUserData();
        logInButtonPressed();
        console.log("a");
      }
    }
  }, [userDataLS, userName]);

  return (
    <div className="log-in-bar">
      {isLoadingLogin ? (
        <div className="loading-container">
          <Loading />
        </div>
      ) : (
        <>
          <div>Log in to join the leaderboard!</div>
          <input
            type="text"
            className="username-field"
            value={userName}
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            onFocus={onFocusIn}
            onBlur={onFocusOut}
          />
          <button className="login-button"
          onClick={logInButtonPressed}>Log In</button>
          <div>{statusMsg}</div>
        </>
      )}
    </div>
  );
}
