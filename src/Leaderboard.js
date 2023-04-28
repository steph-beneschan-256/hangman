import "./leaderboard.css";
import "./modal.css";

export default function Leaderboard({leaderboardData, currentUserID, onClose}) {
    console.log(leaderboardData);
    return(
        <div className="leaderboard">
            {leaderboardData ? (<>
            <div className="leaderboard-header">
                <div className="rank">Rank:</div>
                <div className="name">Name:</div>
                <div className="score">Games Won:</div>
            </div>
            {leaderboardData.map((data, index) => {
                console.log(data);
                const backgroundClass = (data["id"] === currentUserID) ? "current-user" : (index % 2===0 ? "even-row" : "odd-row");
                return(<div className={`data-row ${backgroundClass}`}>
                    <div className="rank">
                        {index+1}
                        {(index+1>=1)&&(index+1<=3) && (
                            <img src={`crown-${index+1}.svg`} alt=""/>
                        )}
                    </div>
                    
                    <div className="name">
                        {data.name}
                    </div>
                    
                    <div className="score">
                        {data.score}
                    </div>
                </div>)
            })}</>)
            :(<div>Loading leaderboard data...</div>)}
        </div>
    )
}