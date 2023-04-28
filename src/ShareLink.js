import { useState } from 'react';
import './shareLink.css';
import "./modal.css";
import languageManager from './languageManager';

export default function ShareLink ({ dataEndpoint, onClose }) {
  //this UI component encompasses all functionality related to creating a new word

  const appLink = 'localhost:3000'; //this needs to be updated when hosting occurs
  const toggleDefaultMessage = 'Create a game for a friend';
  const [link, setLink] = useState('');
  const [warning, setWarning] = useState('');
  const [userWord, setUserWord] = useState('');
  const [userHint, setUserHint] = useState('');
  const [toggleText, setToggleText] = useState(toggleDefaultMessage);
  const [formVisibility, setFormVisibility] = useState('hidden');
  const [submitButtonClass, setSubmitButtonClass] = useState('inactive');
  const [copyMessage, setCopyMessage] = useState('');
  const [linkDisplay, setLinkDisplay] = useState('hidden')

  const [submitDisabled, setSubmitDisabled] = useState(true); 
  const [generatingLink, setGeneratingLink] = useState(false);

  const charLimit = 30;

  const handleWordChange = (e) => {
    //may not enter space as first character
    //must only enter letters a-z A-Z and space
    setUserWord(e.target.value);
    validateInput(e.target.value, userHint);
    // if (e.target.value.length > 0) {
    //   if (!/^[A-Za-z\s\b]$/.test(e.target.value.slice(-1))) {
    //     setWarning('Please enter a valid letter character from a through z');
    //   } else {
    //       if (e.target.value.length > charLimit) {
    //         setWarning('Error: Character length for word shall not exceed ' + charLimit)
    //       }
    //       else {
    //         checkWarning();
    //         if(!/^[\s]$/.test(e.target.value[0])) {
    //           setUserWord(e.target.value)
    //         }
    //       }
    //     }
    // } else {
    //   checkWarning();
    //   setUserWord(e.target.value)
    // }
  }

  const handleHintChange = (e) => {
    setUserHint(e.target.value);
    validateInput(userWord, e.target.value);
    // if (e.target.value.length > charLimit) {
    //   setWarning('Error: Character length for hint shall not exceed ' + charLimit)
    // }
    // else {
    //   checkWarning();
    //   setUserHint(e.target.value)
    // }
  }

  function containsAtLeastOneLetter(str) {
    let b = false;
    Array(...str).forEach(char => {
      if(languageManager.isValidChar(char))
        b = true;
    })
    return b;
  }

  const validateInput = (word=userWord, hint=userHint) => {
    console.log('check warning');
    if(word === "") {
      setWarning("");
      setSubmitDisabled(true);
    }
    else if(!containsAtLeastOneLetter(word)) {
      setWarning("Please enter a word with at least one letter (A-Z).");
      setSubmitDisabled(true);
    }
    else if(word.length > charLimit) {
      setWarning("Please enter a word less than 30 characters long.");
      setSubmitDisabled(true);
    }
    else if(hint > charLimit) {
      setWarning("Hint is too long");
      setSubmitDisabled(true);
    }
    else {
      setWarning("");
      setSubmitDisabled(false);
    }
  }

  const toggleForm =() => {
    //changes shows or hides the form element for creating a word
    if (toggleText === toggleDefaultMessage) {
      setFormVisibility('visible');
      setToggleText('Cancel');
    } else {
      if (toggleText === 'Cancel') {
        setUserWord('');
        setUserHint('');
        setLink('');
        setToggleText(toggleDefaultMessage);
        setFormVisibility('hidden');
      }
    }
  }

  const generateLinkHandler = () => {
    //check if warning exists or not
    // if (warning.length > 0 || userWord.length === 0) {
    //   return;
    // }
    //no warning, submit POST to API endpoint

    setGeneratingLink(true);

    fetch(`${dataEndpoint}/word`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Connection: "keep-alive",
      },
      body: JSON.stringify({
        word: {
          word: userWord,
          hint: userHint,
          userId: ''
        },
      }),
    }).then((response) => {
      if (response.status === 404) {
        console.log('error in POST word request, 404 error')
      }
      response.json().then(a => {
        console.log(a);
        setLink(appLink+'/word/' + a.id);
        setLinkDisplay('visible');
        setGeneratingLink(false);
      })
      .catch((err) => {
        console.log('error in obtaining Word from user link')
        console.log(err);

        setGeneratingLink(false);
      })
    });
  }

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        setCopyMessage('Copied!');
      },
      () => {
        console.log('error copying to clipboard');
      }
    );
  }
  return (
      <div className='shareLinkContainer'>
        <div className={`createWordForm`}>
          <p>Step 1: Create your word (max 30 character limit)</p>
          <form><input onChange={handleWordChange} value={userWord}></input></form>
          <p>Step 2: Provide a hint (optional, max 30 character limit)</p>
          <form><input onChange={handleHintChange} value={userHint}></input></form>
          <p>Step 3: Share the link to a friend</p>
          <button className={"menu-button"} disabled={submitDisabled} onClick={generateLinkHandler}>Generate Link</button>
          <p>{warning}</p>
          {generatingLink && (<div>Generating Link...</div>)}
          <div className='link-container'>
            <div className={linkDisplay}>
              <div className='flex justify-center link-display'>
                <p>{link}</p>
                <img className='copy-image' onClick={copyLink} src="https://img.icons8.com/material-sharp/24/null/copy.png" alt='copy'/>
              </div>
              <p> {copyMessage}</p>
            </div>
          </div>
        </div>
      </div>
  )
}