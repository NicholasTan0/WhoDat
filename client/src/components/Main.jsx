import { useState, useEffect, useRef } from 'react'
import '../stylesheets/App.css'
import silhouette from '../assets/silhouette.png';
import favicon from '../assets/favicon.png'

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
    const [originalLives, setOriginalLives] = useState(lives);

    const [duration, setDuration] = useState(timeLimit * 1000); 
    const [timeLeft, setTimeLeft] = useState(duration);
    const [running, setRunning] = useState(false);

    const endTimeRef = useRef(null);
    const intervalRef = useRef(null);

    const start = () => {
        if (running) {
            return;
        }
        endTimeRef.current = Date.now() + timeLeft;
        setRunning(true);

        intervalRef.current = setInterval(() => {
        const remaining = endTimeRef.current - Date.now();
        if (remaining <= 0) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setTimeLeft(0);
            handleWrong();
        } else {
            setTimeLeft(remaining);
        }
        }, 50);
    };

    const stop = () => {
        if (!running) {
            return;
        }
        clearInterval(intervalRef.current);
        setRunning(false);
        setTimeLeft(endTimeRef.current - Date.now());
    };

    const reset = () => {
        clearInterval(intervalRef.current);
        setRunning(false);
        setTimeLeft(duration);
    };

    useEffect(() => {
        const seconds = Number(timeLimit);
        const ms = seconds * 1000;
        clearInterval(intervalRef.current);
        setRunning(false);
        setDuration(ms);
        setTimeLeft(ms);
    }, [timeLimit])

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(reset, [enableTime]);

    useEffect(()=>{
        console.log(lives);
        console.log("OG:" + originalLives)
        if(lives <= 0) {
            alert("Oops! Better luck next time. 🏀"); 
            clearAll();
            setLives(originalLives);
        }
    },[lives])

    useEffect(()=>{
        if(currentPlayer !== null && enableTime) start();
    },[currentPlayer]) 

    const secondsDisplay = Math.ceil(timeLeft / 1000);
    const millisecondsDisplay = Math.ceil((timeLeft % 1000) / 10)
        .toString()
        .padStart(2, "0");

    const modal = useRef(null);

    const startModal = useRef(null);

    useEffect(() => {
        clearAll();
        startModal.current.showModal();
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
        setIsExploding(true);
        setTimeout(()=>{
            if(enableTime) stop();
            modal.current.showModal();
        },0);
        setTimeout(()=>{
            if(enableTime) reset();
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
        if(enableLives && lives > 0) setLives(lives-1);
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
        setTimeout(()=>{
            if(enableTime) stop();
            modal.current.showModal();
        },0);
        setTimeout(()=>{
            if(enableTime) reset();
            modal.current.close();
            if(lives > 1) generateFourPlayers();
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
                let onlyName = results[0].name;
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
        if(enableTime) reset();
        const message = "Are you sure you want to change difficulties?" + (enableLives ? "\n• Your lives will be reset" : "") + (enableTime ? "\n• The timer will start immediately." : "");
        if(confirm(message)){
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
            setLives(originalLives);
            setStreak(0);
            setDifficulty(newDifficulty);
            clearAll();
            generateFourPlayers();
        }
        
        else{
            setStreak(0);
            setDifficulty(newDifficulty);
            clearAll();
        }
    }

    const renderHearts = () => {
        const hearts = [];
        for(let i = 0; i < lives; i++){
            hearts.push(<span key={i}>❤️</span>);
        }
        if(hearts.length > 0) return hearts;
        return <b style={{color: 'red'}}>0</b>;
    }

    return (
        <main>
            {/* DIFFICULTY BUTTONS */}
            <div className='difficulty-button-container'>
                <button onClick={()=>handleChangeDifficulty("EASY")} className='easy-button' id={difficulty=='EASY' ? 'selected' : ''} disabled={difficulty=='EASY'}>Easy</button>
                <button onClick={()=>handleChangeDifficulty("NORMAL")} className='normal-button' id={difficulty=='NORMAL' ? 'selected' : ''} disabled={difficulty=='NORMAL'}>Normal</button>
                <button onClick={()=>handleChangeDifficulty("HARD")} className='hard-button' id={difficulty=='HARD' ? 'selected' : ''} disabled={difficulty=='HARD'}>Hard</button>
            </div>
    
            {/* STREAK & BEST */}
            <div className='text-container'>
                <div>Current Streak: <strong style={{color: streak > 0 ? 'darkgreen' : 'inherit'}}>{streak}{streak > 0 && '🔥'}</strong></div>
                <div>|</div>
                {enableLives && <div id='lives'>
                    <div>
                        Lives: {renderHearts()}
                    </div>
                    <div>|</div>
                </div>}
                <div>Personal Best: {difficulty=="EASY" && <strong>{personalBestEasy}</strong>} {difficulty=="NORMAL" && <strong>{personalBestNormal}</strong>} {difficulty=="HARD" && <strong>{personalBestHard}</strong>}</div>
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

            {(currentPlayer && enableTime) && <div className='timer'>
                <button title={running ? 'Pause' : 'Play'} onClick={()=>{
                    if(running) stop();
                    else start();
                }}>{(running) ? '⏸️' : '▶️'}</button>
                {secondsDisplay} {/*.{millisecondsDisplay}*/}
                <button title='Reset' onClick={reset}>⏹️</button>
            </div>}

            {/* PLAYER IMAGE */}
            {currentPlayer ? 
                <img id='playerImg' src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${currentPlayer.id}.png&w=350&h=254`} alt='Guess the player' onError={()=>generateFourPlayers()} style={{filter: (difficulty=="HARD" && !isExploding) ? 'brightness(0%)' : ''}}></img> : 
                <div className='silhouette-container'>
                    <img width='436px' style={{marginTop: '20px'}} src={silhouette}></img>
                    <button onClick={()=>generateFourPlayers()} id='start-button' className={difficulty}>Start Game!</button>
                </div>
            }

            <dialog id='modal' ref={modal}>
                <div className='modal-container'>
                    {/* {isExploding && <ConfettiExplosion></ConfettiExplosion>} */}
                    {correct ? 
                    <div className='correct-container'>
                        <div style={{fontSize: '4em'}}>✅</div>
                        <div><b>Correct!</b></div>
                    </div> : 
                    <div className='incorrect-container'>
                        <div style={{fontSize: '4em'}}>❌</div>
                        <div><b>{currentPlayer?.name}</b></div>
                    </div>}
                </div>
            </dialog>

            <dialog id='startModal' ref={startModal}>
                <div className='modal-container'>
                    <h1>Welcome to <span>WhoDat!</span></h1>
                    <img src={favicon}/>
                    <h3>NBA Player Guessing Game</h3>
                    <p>Note: Some players may not appear due to their headshot not currently being available on ESPN. Additionally, some hints may be missing information due to the same reason.</p>
                    <button onClick={()=>startModal.current.close()}>Close</button>
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
            {(currentPlayer && enableHints) && 
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

            {currentPlayer && <button id='give-up-button' onClick={handleWrong}>Give up?</button>}
        </main>
    )
}

export default Main