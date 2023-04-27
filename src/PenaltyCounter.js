export default function PenaltyCounter({penalties, maxPenalties}) {
    return(
        <div className="penalty-counter">
            {/* <img src={`progress_img/${penalties}.png`} */}
            <img src="heart.svg"
            alt={`You've made ${penalties} mistakes so far.`}/>
            <span>{maxPenalties + 1 - penalties}</span>
        </div>
    )
}