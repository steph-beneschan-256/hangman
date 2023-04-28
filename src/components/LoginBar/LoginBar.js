import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

export default function LoginBar({
  onLoggedIn,
  dataEndpoint,
  setUserDataLS,
  userDataLS,
}) {
  const [userName, setUserName] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  async function getUserData() {
    console.log("llamada");
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
        const tasks = jsonData["tasks"];
        return { id: userID, tasks: tasks };
      });
      return data;
    } else {
      // Must register user
      console.log(userName);
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
          const tasks = [];
          return { id: userID, tasks: tasks };
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
      setIsLoadingLogin(true);
      if (userData) {
        onLoggedIn({
          id: userData["id"],
          name: userName,
          tasks: userData["tasks"],
        });
        setUserDataLS(userName);
      } else setStatusMsg("An unknown error has occurred");
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
        <Loading />
      ) : (
        <>
          <div className="loginBarContainer">
            <input
              type="text"
              className="username-field"
              value={userName}
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={logInButtonPressed}>Log In</button>
          </div>
          <div>{statusMsg}</div>
        </>
      )}
    </div>
  );
}
