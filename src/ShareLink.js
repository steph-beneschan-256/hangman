import { useState } from 'react';
import './shareLink.css';

export default function ShareLink () {
  //this UI component encompasses all functionality related to creating a new word

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

  const charLimit = 30;

  const handleWordChange = (e) => {
    //may not enter space as first character
    //must only enter letters a-z A-Z and space
    if (e.target.value.length > 0) {
      if (!/^[A-Za-z\s\b]$/.test(e.target.value.slice(-1))) {
        setWarning('Please enter a valid letter character from a through z');
      } else {
          if (e.target.value.length > charLimit) {
            setWarning('Error: Character length for word shall not exceed ' + charLimit)
          }
          else {
            checkWarning();
            if(!/^[\s]$/.test(e.target.value[0])) {
              setUserWord(e.target.value)
            }
          }
        }
    } else {
      checkWarning();
      setUserWord(e.target.value)
    }
  }

  const handleHintChange = (e) => {
    if (e.target.value.length > charLimit) {
      setWarning('Error: Character length for hint shall not exceed ' + charLimit)
    }
    else {
      checkWarning();
      setUserHint(e.target.value)
    }
  }

  const checkWarning = () => {
    console.log('check warning');
    if (userWord.length < charLimit && userHint.length < charLimit && /^[A-Za-z\s\b]$/.test(userWord.slice(-1))) {
      setWarning('');
      if (userWord.length > 0) {
        setSubmitButtonClass('active');
      }
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
    if (warning.length > 0 || userWord.length === 0) {
      return;
    }
    //no warning, submit POST to API endpoint

    //upon success, set the link
    setLink('sample link');
    setLinkDisplay('visible');

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
      <button onClick={toggleForm}>{toggleText}</button>
      <div className={`createWordForm ${formVisibility}`}>
        <p>Step 1: Create your word (max 30 character limit)</p>
        <form><input onChange={handleWordChange} value={userWord}></input></form>
        <p>Step 2: Provide a hint (optional, max 30 character limit)</p>
        <form><input onChange={handleHintChange} value={userHint}></input></form>
        <p>Step 3: Share the link to a friend</p>
        <button className={`submitButton ${submitButtonClass}`} onClick={generateLinkHandler}>Generate Link</button>
        <p>{warning}</p>
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