export default function PenaltyCounter({penalties}) {
    return(
        <div className="penalty-counter">
            <img src={`progress_img/${penalties}.png`}
            alt={`You've made ${penalties} mistakes so far.`}/>
        </div>
    )
}