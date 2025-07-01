import { useState, useEffect, useRef } from 'react'
import '../stylesheets/App.css'
import silhouette from '../assets/silhouette.png';

function Main({
    enableLives, 
    lives,
    enableHints,
    hints, 
    enableTime,
    timeLimit, 
    setEnableLives, 
    setLives,
    setEnableHints,
    setHints, 
    setEnableTime,
    setTimeLimit,
}) {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [currentPlayer, setPlayer] = useState(null);
    const [difficulty, setDifficulty] = useState("NORMAL");
    const [options, setOptions] = useState([]);
    const [isExploding, setIsExploding] = useState(false);
    const [streak, setStreak] = useState(0);
    const [personalBestEasy, setPersonalBestEasy] = useState(0);
    const [personalBestNormal, setPersonalBestNormal] = useState(0);
    const [personalBestHard, setPersonalBestHard] = useState(0);
    const [correct, setCorrect] = useState(false);
    const [guess, setGuess] = useState(null);
    const [showTeam, setShowTeam] = useState(false);
    const [showPosition, setShowPosition] = useState(false);
    const [showAge, setShowAge] = useState(false);
    const [showHeight, setShowHeight] = useState(false);
    const [showCollege, setShowCollege] = useState(false);
    const [showNumber, setShowNumber] = useState(false);
    
    const modal = useRef(null);

    useEffect(() => {
        clearAll();
    },[])
  
    const BASE_URL = import.meta.env.VITE_API_URL;

    const clearAll = () => {
        setInput("");
        setResults([]);
        setPlayer(null);
        setOptions([]);
        setGuess(null);
        setShowTeam(false);
        setShowPosition(false);
        setShowAge(false);
        setShowHeight(false);
        setShowCollege(false);
        setShowNumber(false);
    }

    const generateFourPlayers = async (id) => {
        const response = await fetch(`${BASE_URL}/random-four?excludeId=${id}`);
        let players = await response.json();
        setTimeout(() => {
        setOptions(players);
        setPlayer(players[Math.floor(Math.random() * 4)]);
        }, 0);
    };

    const handleInput = (value) => {
        setInput(value);
        
        fetch(`${BASE_URL}/search?name=${encodeURIComponent(value)}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(value) setResults(data);
            else setResults([]);
        });
    };

    const handleRight = () => {
        setCorrect(true);
        setStreak(streak+1);
        setResults([]);
        setInput("");
        modal.current.showModal();
        setIsExploding(true);
        setTimeout(()=>{
            modal.current.close();
            generateFourPlayers();
            setIsExploding(false);
            setGuess(null);
            setShowTeam(false);
            setShowPosition(false);
            setShowAge(false);
            setShowHeight(false);
            setShowCollege(false);
            setShowNumber(false);
        },1000);
    }

    const handleWrong = () => {
        setCorrect(false);
        switch (difficulty) {
        case 'EASY':
            if(streak > personalBestEasy) setPersonalBestEasy(streak);
            break;
        case 'NORMAL':
            if(streak > personalBestNormal) setPersonalBestNormal(streak);
            break;
        case 'HARD':
            if(streak > personalBestHard) setPersonalBestHard(streak);
            break;
        }
        setStreak(0);
        setResults([]);
        setInput("");
        modal.current.showModal();
        setTimeout(()=>{
            modal.current.close();
            generateFourPlayers();
            setGuess(null);
            setShowTeam(false);
            setShowPosition(false);
            setShowAge(false);
            setShowHeight(false);
            setShowCollege(false);
            setShowNumber(false);
        },1000);
    }

    const checkCorrect = (name) => {
        setGuess(name);
        if(currentPlayer.name == name) handleRight();
        else handleWrong();
    }

    const handleKeyDown1 = (event) => {
        if(event.key == 'Escape'){
            setInput("");
            setResults([]);
        }
        else if(event.key == 'Enter'){
            if(results.length == 1){
                const onlyName = results[0].name;
                setInput(onlyName);
                setTimeout(()=>checkCorrect(onlyName),100);
            }
        }
    }

    const handleKeyDown2 = (event, name) => {
        if(event.key == 'Escape'){
            setInput("");
            setResults([]);
        }
        else if(event.key == 'Enter'){
            setInput(name);
            setTimeout(()=>checkCorrect(name),0);
        }
    }

    const handleChangeDifficulty = (newDifficulty) => {
        if(streak > 0){
            if(confirm(`Are you sure you want to change difficulties?`)){
                switch (difficulty) {
                case 'EASY':
                    if(streak > personalBestEasy) setPersonalBestEasy(streak);
                    break;
                case 'NORMAL':
                    if(streak > personalBestNormal) setPersonalBestNormal(streak);
                    break;
                case 'HARD':
                    if(streak > personalBestHard) setPersonalBestHard(streak);
                    break;
                }
                setStreak(0);
                setDifficulty(newDifficulty);
                clearAll();
                generateFourPlayers();
            }
        }
        else{
            setStreak(0);
            setDifficulty(newDifficulty);
            clearAll();
        }
    }

    const handleGiveUp = () => {
        setLives(0);
        setCorrect(false);
    }

    return (
        <main>
            {/* DIFFICULTY BUTTONS */}
            <div className='difficulty-button-container'>
                <button onClick={()=>handleChangeDifficulty("EASY")} id='easy-button' className={difficulty=='EASY' ? 'selected' : ''} disabled={difficulty=='EASY'}>Easy</button>
                <button onClick={()=>handleChangeDifficulty("NORMAL")} id='normal-button' className={difficulty=='NORMAL' ? 'selected' : ''} disabled={difficulty=='NORMAL'}>Normal</button>
                <button onClick={()=>handleChangeDifficulty("HARD")} id='hard-button' className={difficulty=='HARD' ? 'selected' : ''} disabled={difficulty=='HARD'}>Hard</button>
            </div>
    
            {/* STREAK & BEST */}
            <div className='text-container'>
                <span>Current Streak: </span>
                <strong style={{color: streak > 0 ? 'darkgreen' : 'inherit'}}>{streak}{streak > 0 && '🔥'}</strong>
                <br style={{display: ''}}></br>
                <span>Personal Best: </span>
                {difficulty=="EASY" && <strong>{personalBestEasy}</strong>}
                {difficulty=="NORMAL" && <strong>{personalBestNormal}</strong>}
                {difficulty=="HARD" && <strong>{personalBestHard}</strong>}

                {enableLives && <div>
                    Lives: {lives}
                </div>}
            </div>
    
            {/* SEARCH BAR & RESULTS */}
            {(difficulty !== "EASY" && currentPlayer) && <div className='search-bar-container'>
                <div className='search-bar'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580t75.5-184.5T380-840t184.5 75.5T640-580q0 44-14 83t-38 69l252 252zM380-400q75 0 127.5-52.5T560-580t-52.5-127.5T380-760t-127.5 52.5T200-580t52.5 127.5T380-400"/></svg>
                    <input value={input} onChange={(e)=>handleInput(e.target.value)} onKeyDown={handleKeyDown1} onFocus={()=>{handleInput(input)}} placeholder='Search by Name...' type='search'></input>
                </div>
                <div className='results-list'>
                {results.map((player) => (
                    <div className='search-result' role='button' tabIndex="0" onKeyDown={(e)=>handleKeyDown2(e, player.name)} onClick={()=>checkCorrect(player.name)} key={player.id}>{player.name}</div>
                ))}
                </div>
            </div>}
            
            {/* PLAYER IMAGE */}
            {currentPlayer ? <img id='playerImg' src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${currentPlayer.id}.png&w=350&h=254`} alt='Guess the player' onError={()=>generateFourPlayers()} style={{filter: (difficulty=="HARD" && !isExploding) ? 'brightness(0%)' : ''}}></img> : <div className='silhouette-container'>
                <img width='436px' style={{marginTop: '20px'}} src={silhouette}></img>
                <button onClick={()=>generateFourPlayers()} id='start-button'>Click here to start!</button>
            </div>}
    
            <dialog id='modal' ref={modal}>
                <div className='modal-container'>
                    {/* {isExploding && <ConfettiExplosion></ConfettiExplosion>} */}
                    {correct ? <b>Correct!</b> : 
                    <div>
                        <span style={{fontSize: '100px'}}>&#10060;</span>
                        <b>Incorrect</b>
                    </div>}
                </div>
            </dialog>
            
            {/* OPTIONS */}
            {(currentPlayer && difficulty == "EASY") && 
            <div className='options-container'>
              {options.map((option) => (
                <div onClick={()=>checkCorrect(option.name)} key={option.id}>
                  <button className={`options ${((guess == option.name) && (guess !== currentPlayer.name)) && 'shaker'} ${guess && (option.name == guess ? (guess == currentPlayer.name ? 'correct' : 'incorrect') : (option.name == currentPlayer.name && 'correct'))}`} >{option.name} 
                  {guess && (option.name == guess ? (guess == currentPlayer.name ? 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                  </svg>) : 
                  (option.name == currentPlayer.name && 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>))}
                </button>
                </div>
              ))}
            </div>
            }
            
            {/* HINTS */}
            {(currentPlayer && difficulty !== "EASY" && enableHints) && 
                <div className='hint-container'>
                    <table>
                        <thead>
                            <tr>
                                {hints.team && <th>Team</th>}
                                {hints.position && <th>Position</th>}
                                {hints.age && <th>Age</th>}
                                {hints.height && <th>Height</th>}
                                {hints.college && <th>College</th>}
                                {hints.number && <th>Number</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {hints.team && <td>
                                    {showTeam ? <img src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${currentPlayer.team}.png&h=200&w=200`}></img> : <button onClick={()=>setShowTeam(true)}>Show</button>}
                                </td>}
                                {hints.position && <td>
                                    {showPosition ? <div>{currentPlayer.position}</div> : <button onClick={()=>setShowPosition(true)}>Show</button>}
                                </td>}
                                {hints.age && <td>
                                    {showAge ? <div>{currentPlayer.age}</div> : <button onClick={()=>setShowAge(true)}>Show</button>}
                                </td>}
                                {hints.height && <td>
                                    {showHeight ? <div>{currentPlayer.height}</div> : <button onClick={()=>setShowHeight(true)}>Show</button>}
                                </td>}
                                {hints.college && <td>
                                    {showCollege ? <div>{currentPlayer.college}</div> : <button onClick={()=>setShowCollege(true)}>Show</button>}
                                </td>}
                                {hints.number && <td>
                                    {showNumber ? <div>{currentPlayer.number}</div> : <button onClick={()=>setShowNumber(true)}>Show</button>}
                                </td>}
                            </tr>
                        </tbody>
                    </table>
                </div>}

            {currentPlayer && <button onClick={handleGiveUp}>Give up?</button>}
        </main>
    )
}

export default Main