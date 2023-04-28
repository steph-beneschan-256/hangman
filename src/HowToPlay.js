import "./modal.css";

export default function HowToPlay({onClose}) {
    
    return(
        <div className="how-to-play">
            <p>
                Every game of Hangman has a secret phrase. To win the game, you must reveal that phrase, one letter at a time. 
            </p>
            <p>
                To select a letter, either click on it using the on-screen keyboard, or (if you have a physical keyboard) type the letter on your keyboard.
                </p>
            <p>
                If the letter you selected is part of the secret phrase, then that part of the phrase will be revealed. Otherwise, you will lose one balloon.
            </p>
            <p>
                You begin the game with six balloons. If you lose all six, then the game is over. In order to win the game, you must fully reveal the secret phrase without losing all six baloons.
            </p>
            <button onClick={onClose}>Close</button>
        </div>
    )
}