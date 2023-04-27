import "./penaltyCounter.css";

export default function PenaltyCounter({penalties, maxPenalties}) {
    return(
        <div className="penalty-counter">
            <div className="img-container">
                {(penalties <= maxPenalties+1) &&
                    <img src={`stickman/${penalties}.png`}
                    alt={`You've made ${penalties} mistakes so far.`}/>
                }
            </div>
            <div>
                <span className="chance-counter">
                    {maxPenalties + 1 - penalties}
                </span>
                <span> {(maxPenalties + 1 - penalties === 1) ?
                "chance remains"
                : "chances remain"}</span>
            </div>

        </div>
    )
}

// export default function PenaltyCounter({penalties, maxPenalties}) {
//     return(
//         <div className="penalty-counter">
//             {/* <img src={`progress_img/${penalties}.png`} */}
//             <img src="heart.svg"
//             alt={`You've made ${penalties} mistakes so far.`}/>
//             <span>{maxPenalties + 1 - penalties}</span>
//         </div>
//     )
// }