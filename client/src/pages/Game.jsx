import { useState, useEffect, useRef } from 'react'
import Countdown from '../components/Countdown';
import Lock from '../components/Lock';
import Toggle from '../components/Toggle';

export default function Game({ difficulty, setDifficulty }) {
    const [startGame, setStartGame] = useState(false);
    const [allPlayers, setAllPlayers] = useState([]);
    const [randomFour, setRandomFour] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [silhouette, setSilhouette] = useState('/silhouette.png');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [index, setIndex] = useState(-1);
    const [focused, setFocused] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [round, setRound] = useState(1);
    const [prevStreak, setPrevStreak] = useState(0);
    const [streak, setStreak] = useState(0);
    const [best, setBest] = useState(0);
    const [guessed, setGuessed] = useState(false);
    const [wrongAnswer, setWrongAnswer] = useState(null);
    const [showTimer, setShowTimer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(60000));
    const [isPaused, setIsPaused] = useState(true);
    const [showBlank, setShowBlank] = useState(false);
    const [showTeam, setShowTeam] = useState(false);
    const [show50, setShow50] = useState([])
    const [hiddenName, setHiddenName] = useState(null);
    const [points, setPoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [durationMs, setDurationMs] = useState(30000);
    const [autoplay, setAutoplay] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [modal, setModal] = useState("settings");

    const inputRef = useRef(null);
    const itemRefs = useRef([]);
    const remainingMsRef = useRef(durationMs);

    const POINT_FACTOR = 2;

    function formatTimeLeft(difference){
        if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    };

    useEffect(() => {
        fetch('/players.json')
            .then(response => response.json())
            .then(data => setAllPlayers(data))
            .catch(err => console.error('Failed to load players:', err));
    }, []);

    useEffect(()=>{
        if(currentPlayer !== null && currentPlayer.name !== null){
            setHiddenName(Array.from(currentPlayer.name).map((letter) => /^[a-zA-Z]$/.test(letter) ? "_" : letter));
        }
    }, [currentPlayer])

    useEffect(()=>{
        if(currentPlayer && timeLeft.expired === true){
            handleAnswer("");
        }
    }, [timeLeft.expired])

    useEffect(()=>{
        setTimeLeft(() => formatTimeLeft(durationMs))
    }, [durationMs])

    useEffect(()=>{
        if(startGame){
            inputRef.current?.focus();
        }
    }, [guessed])

    useEffect(() => {
        if (index >= 0 && itemRefs.current[index]) {
            itemRefs.current[index].scrollIntoView({
                block: "nearest",
            });
        }
    }, [index]);

    useEffect(()=>{
        if(startGame){
            if(allPlayers.length >= 4){
                generateFour()
            }
            if(showTimer){
                setIsPaused(false)
            }
        }
    }, [startGame])

    useEffect(()=>{
        if(autoplay && guessed && !isOpen){
            generateFour();
            setRound(round + 1);
            setIsPaused(false);
            setGuessed(false);
            setInput("");
        }
    }, [autoplay])

    useEffect(() => {
        if (randomFour.length < 4) return;
        const player = randomFour[Math.floor(Math.random() * randomFour.length)];
        setCurrentPlayer(player);
        setPoints(player.points)
        setSilhouette(`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.id}.png`);
    }, [randomFour]);

    const handleInput = (e) => {
        setInput(e.target.value);
        if(!e.target.value) {
            setResults([]);
            return;
        }
        if(difficulty === "hard") return;
        const query = e.target.value.toLowerCase();
        const filtered = allPlayers.filter(player =>
            player.name.toLowerCase().replace(/[^a-z'\-\s]/g, '').replace(/\s+/g, ' ').includes(query)
        );
        setResults(filtered);
    };

    const handleKeyDown = (e) => {
        if (e.target.value.length === 0) {
            setIndex(-1);
            return;
        }
        if(e.key === 'Enter'){
            if(difficulty === "hard"){
                handleAnswer(input);
            }
            else{
                if(results.length > 0 && input.toLowerCase() === results[0].name.toLowerCase())
                    handleAnswer(input);
                else if(results.length > 0 && index === -1){
                    setInput(results[0].name);
                    setIndex(index + 1);
                }
                else handleAnswer(input);
            }
            
        }
        else if(e.key === 'Escape'){
            setInput("")
            setResults([])
        }
        else if (e.key === 'ArrowDown' || e.key === 'Tab') {
            e.preventDefault();

            if (results.length === 0) return;

            const nextIndex = (index + 1) % results.length;

            setIndex(nextIndex);
            setInput(results[nextIndex].name);
        }

        else if (e.key === 'ArrowUp') {
            e.preventDefault();

            if (results.length === 0) return;

            const nextIndex = (index - 1 + results.length) % results.length;

            setIndex(nextIndex);
            setInput(results[nextIndex].name);
        }
    };

    const generateFour = () => {
        setHasError(false);
        setHasLoaded(false);
        let uniqueNumbers = [];

        while(uniqueNumbers.length < 4){
            const randomNumber = Math.floor(Math.random() * allPlayers.length)
            if(!uniqueNumbers.includes(randomNumber)) uniqueNumbers.push(randomNumber)
        }
    
        setRandomFour([
            allPlayers[uniqueNumbers[0]], 
            allPlayers[uniqueNumbers[1]], 
            allPlayers[uniqueNumbers[2]], 
            allPlayers[uniqueNumbers[3]]
        ])
    }

    const handleImageError = () => {
        if(!hasError) {
            setHasError(true);
            setSilhouette(`https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/${currentPlayer?.id}.png`)
        } else {
            generateFour();
        }
    };

    function endStreak(){
        if(streak > best){
            setBest(streak);
        }
        setPrevStreak(streak)
        setStreak(0);
    }

    function isCorrect(userInput, correctAnswer) {
        const normalize = (str) =>
            str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();

        const user = normalize(userInput);
        const correct = normalize(correctAnswer);

        if (user === correct) return true;

        const userNoPeriods = user.replace(/\./g, "");
        const correctNoPeriods = correct.replace(/\./g, "");

        if (userNoPeriods !== correctNoPeriods) {
            return false;
        }

        for (let i = 0; i < user.length; i++) {
            if (user[i] === ".") {
                if (correct[i] !== ".") {
                    return false;
                }
            }
        }

        let userIndex = 0;

        for (let correctIndex = 0; correctIndex < correct.length; correctIndex++) {
            if (correct[correctIndex] === ".") {
                if (user[userIndex] === ".") {
                    userIndex++;
                }
            } else {
                if (user[userIndex] !== correct[correctIndex]) {
                    return false;
                }
                userIndex++;
            }
        }

        return userIndex === user.length;
    }

    const revealNextLetter = () => {
        if (!currentPlayer) return;

        setHiddenName(prev => {
            const index = prev.findIndex(letter => letter === "_");

            if (index === -1) return prev;

            const updated = [...prev];
            updated[index] = currentPlayer.name[index];

            return updated;
        });

        setPoints(Math.floor(points/POINT_FACTOR))
    };

    // const revealRandomLetter = () => {
    //     if (!currentPlayer) return;

    //     setHiddenName(prev => {
    //         const unrevealed = prev
    //             .map((letter, index) => letter === "_" ? index : null)
    //             .filter(index => index !== null);

    //         if (unrevealed.length === 0) return prev;

    //         const randomIndex =
    //             unrevealed[Math.floor(Math.random() * unrevealed.length)];

    //         const updated = [...prev];
    //         updated[randomIndex] = currentPlayer.name[randomIndex];

    //         return updated;
    //     });
    // };

    const handleAnswer = (name) => {
        const responseTime = durationMs - remainingMsRef.current;
        const earnedPoints = showTimer
            ? Math.round(points * (1 - responseTime / (2 * durationMs)))
            : points;
        setPoints(earnedPoints);
        setInput(currentPlayer.name);
        setGuessed(true);
        setIsPaused(true);
        setResults([]);
        setIndex(-1);
        setShow50([]);
        if(isCorrect(name, currentPlayer.name)){
            setCorrect(true);
            setPrevStreak(streak)
            setStreak(streak + 1)
            setTotalPoints(totalPoints + earnedPoints);
            setTimeout(() => {
                setShowBlank(false);
                setWrongAnswer(null);
                if(autoplay){
                    generateFour();
                    setRound(round + 1);
                    setIsPaused(false);
                    setGuessed(false);
                    setCorrect(false);
                    setInput("");
                }
            }, 1000); 
        }
        else {
            setWrongAnswer(name);
            endStreak();
            setTimeout(() => {
                setShowBlank(false);
                setWrongAnswer(null);
                if(autoplay){
                    generateFour();
                    setRound(round + 1);
                    setIsPaused(false);
                    setGuessed(false);
                    setInput("");
                }
            }, 1000); 
        }
    }
    
    return(
        <div className='flex flex-row flex-1 min-h-0'>
            {/* DESKTOP */}
            <main className='hidden lg:flex w-full'>
                {/* LEFT */}
                <section className='flex flex-col w-1/5 border-r-3 bg-offwhite p-8 gap-8'>
                    <button 
                        className='flex justify-center items-center w-min cursor-pointer gap-3'
                        title='Go Back'
                        onClick={()=>setDifficulty(null)}
                    >
                        <svg className='w-8 h-8' viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                        <p className='text-xl text-center'>Home</p>
                    </button>
                    <div className='flex relative gap-8 text-black px-8 py-12 border-2 shadow-lg border-black bg-yellow-500 overflow-auto'>
                        <div className='absolute size-4 top-2 left-2 rounded-full bg-white border-black border-2'/>
                        <div className='flex flex-col text-[2.3cqi] gap-2 w-full'>
                            <h1 className='underline font-bold'>Stats</h1>
                            <div className='flex flex-row'>
                                Streak: {streak}
                                <div className='w-4'>
                                    <div className={`ml-2 animate-bounce ${correct ? '' : 'hidden'}`}>⬆</div>
                                    <div className={`ml-2 animate-bounce ${(guessed && !correct && prevStreak > 0) ? '' : 'hidden'}`}>⬇</div>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                Best: {best}
                            </div>
                            <div className='flex flex-row'>
                                Lives: {"∞"}
                            </div>
                        </div>
                    </div>
                    <div className='flex relative gap-8 text-black px-8 py-12 border-2 shadow-lg border-black bg-yellow-500 overflow-auto'>
                        <div className='absolute size-4 top-2 left-2 rounded-full bg-white border-black border-2'/>
                        <div className='flex flex-col text-[2.3cqi] gap-2 w-full'>
                            <h1 className='underline font-bold'>Points</h1>
                            <div className='flex flex-row'>
                                Maximum: {currentPlayer?.points || 0}
                            </div>
                            <div>Current: {points}</div>
                            <div className='flex flex-row'>
                                Total: {totalPoints}
                            </div>
                        </div>
                    </div>
                </section>

                {/* MIDDLE */}
                <section className={`relative flex flex-col items-center flex-1 bg-blue ${!startGame ? 'pointer-events-none' : ''}`}>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex justify-center items-center mx-8 text-white text-5xl w-2/3 font-lg uppercase border-b-2 mt-8 pb-4 mb-4'>
                            <div>Round {round}</div>
                            {/* <div>&nbsp;-&nbsp;</div>
                            <div className='flex text-red-500 tracking-widest'>❤︎⁠❤︎⁠❤︎⁠</div> */}
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        {difficulty === "easy" && 
                        <div className='flex flex-col justify-center items-center w-full gap-4'>
                            <div className='flex gap-2'> 
                                {showTimer && <div className={`flex w-32 shrink-0 justify-center items-center border-3 text-2xl py-2 ${((timeLeft.minutes === 0) && (timeLeft.seconds <= 10) && (timeLeft.seconds % 2 == 0) && currentPlayer) ? "bg-red text-white border-black" : "bg-white text-black border-black"}`}>
                                    <Countdown 
                                        durationMs={durationMs} 
                                        timeLeft={timeLeft} 
                                        setTimeLeft={setTimeLeft}
                                        isPaused={isPaused}
                                        remainingMsRef={remainingMsRef}
                                        round={round}
                                    />
                                </div>}
                                {(!autoplay && guessed) && <button 
                                    className={`cursor-pointer text-nowrap shrink-0 group flex w-32 justify-center items-center text-white text-2xl py-2 bg-blue-950 border-2 border-black transition-all active:scale-95 ${guessed ? 'animate-pulse' : ''}`}
                                    onClick={()=>{
                                        generateFour();
                                        setRound(round + 1);
                                        setIsPaused(false);
                                        setGuessed(false);
                                        setInput("");
                                        setCorrect(false);
                                    }}
                                >
                                    Next Round
                                </button>}
                            </div>
                            <div className='grid grid-cols-2 grid-rows-2 w-full px-8 gap-3'>
                                {randomFour.map((player, i) => (
                                    <button
                                        disabled={guessed || show50.includes(player)}
                                        key={i} 
                                        className={`
                                            p-4 border-2 border-white w-full h-full text-offwhite transition-all active:scale-95 disabled:opacity-40
                                            ${guessed ? "cursor-not-allowed" : "cursor-pointer hover:bg-offwhite hover:text-blue"}
                                            ${guessed && player.name === currentPlayer.name ? "bg-green-500!" : ""}
                                            ${player.name === wrongAnswer ? "bg-red-600! opacity-40" : ""}
                                            ${guessed && player.name !== currentPlayer.name && player.name !== wrongAnswer ? "opacity-40" : ""}
                                            ${show50.includes(player) ? "line-through" : ""}
                                        `}
                                        onClick={()=>handleAnswer(player.name)}
                                    >
                                        <div className={`text-4xl font-bold ${hasLoaded ? "" : "invisible"}`}>
                                            {player.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        }

                        {(difficulty === "medium" || difficulty === "hard") && 
                        <div className='flex w-2/3 mx-8'>
                            {showTimer && <div className={`flex mr-2 w-24 shrink-0 justify-center items-center border-3 text-2xl px-4 ${((timeLeft.minutes === 0) && (timeLeft.seconds <= 10) && (timeLeft.seconds % 2 == 0) && currentPlayer) ? "bg-red text-white border-black" : "bg-white text-black border-black"}`}>
                                <Countdown 
                                    durationMs={durationMs} 
                                    timeLeft={timeLeft} 
                                    setTimeLeft={setTimeLeft}
                                    isPaused={isPaused}
                                    remainingMsRef={remainingMsRef}
                                    round={round}
                                />
                            </div>}
                            <div className='relative border-0 flex items-center w-full text-2xl'>
                                <svg className='ml-2 absolute w-6 pointer-events-none fill-neutral-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580t75.5-184.5T380-840t184.5 75.5T640-580q0 44-14 83t-38 69l252 252zM380-400q75 0 127.5-52.5T560-580t-52.5-127.5T380-760t-127.5 52.5T200-580t52.5 127.5T380-400"/></svg>
                                <input 
                                    className={`bg-white w-full h-full border-2 border-r-0 px-10 py-4 outline-0 hover:bg-offwhite not-focus:shadow-xl focus:bg-white! ${guessed ? correct ? "bg-green-500! text-white! border-white border-r-2" : "bg-red! text-white! border-white border-r-2" : ""} ${guessed ? "cursor-not-allowed" : ""}`}
                                    value={input}
                                    disabled={guessed}
                                    ref={inputRef} 
                                    onChange={handleInput} 
                                    onKeyDown={handleKeyDown}
                                    onFocus={()=>setFocused(true)}
                                    onBlur={()=>setFocused(false)}
                                    placeholder='Search by Name...' 
                                    type='text'
                                />
                                {difficulty === "medium" && <ul
                                    className='z-10 absolute top-full left-0 w-full max-h-[33vh] mt-1 overflow-y-auto scrollbar-track-offwhite scrollbar-thumb-neutral-500'
                                >
                                    {results.map((player, i) => (
                                        <li 
                                            className={`cursor-pointer border-2 border-black p-2 w-full bg-offwhite ${input.toLowerCase() === player.name.toLowerCase() ? "border-l-8 bg-blue-800! text-offwhite" : "hover:bg-blue-800 hover:text-white"} ${focused ? "" : ""}`}
                                            key={i}
                                            tabIndex='0'
                                            ref={(el) => (itemRefs.current[i] = el)}
                                            onKeyDown={handleKeyDown}
                                            onMouseDown={(e)=>e.preventDefault()}
                                            onClick={()=>{
                                                handleAnswer(player.name);
                                            }}
                                        >
                                            {player.name}
                                        </li>
                                    ))}
                                </ul>}
                            </div>
                            <button 
                                className='cursor-pointer shrink-0 group flex justify-center items-center px-4 bg-offwhite ml-0 border-2 border-black hover:bg-neutral-200'
                                title='Submit Name'
                                onClick={()=>{
                                    if(input.length > 0) handleAnswer(input);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                </svg>
                            </button>
                            <button 
                                className={`cursor-pointer shrink-0 group flex justify-center items-center px-4 text-white text-2xl bg-red ml-2 border-2 border-black transition-all ${guessed ? 'animate-pulse' : ''}`}
                                onClick={()=>{
                                    if(!guessed){
                                        handleAnswer("");
                                    }
                                    else{
                                        generateFour();
                                        setRound(round + 1);
                                        setIsPaused(false);
                                        setGuessed(false);
                                        setInput("");
                                        setCorrect(false)
                                    }
                                }}
                            >
                                <div className='w-25'>{guessed ? "Next Round" : "Don't Know"}</div>
                            </button>
                        </div>
                        }
                    </div>
                    <div className='flex justify-center flex-1 w-full'>
                        <div className='flex aspect-600/436 w-auto h-full border-white overflow-hidden relative'>
                            {!hasLoaded &&
                                <div className='flex justify-center items-center w-full'>
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                                </div>
                            }
                            <img 
                                className={`w-full h-auto object-cover pointer-events-none ${hasLoaded ? 'visible' : 'hidden'} ${startGame ? "" : "brightness-0"}`}
                                src={silhouette}
                                alt='Player'
                                onLoad={()=>setHasLoaded(true)}
                                onError={handleImageError}
                            />
                            {!startGame && <div className='absolute top-[50%] left-[50%] translate-[-50%] pointer-events-auto'>
                                <button 
                                    className='relative cursor-pointer flex justify-center items-center border-2 border-offwhite bg-black p-5 rounded-full'
                                    onClick={()=>setStartGame(true)}
                                >
                                    <div className='text-[clamp(2rem,3rem,4vw)] text-nowrap text-white font-bold font-logo tracking-wide'>Click to Start!</div>
                                </button>
                            </div>}
                        </div>
                    </div>
                </section>
                
                {/* RIGHT */}
                <section className='flex flex-col w-1/5 border-l-3 bg-offwhite p-8 gap-8'>
                    <h1 className='flex justify-center items-center h-8 text-4xl underline'>Hints</h1>
                    <ul className='flex flex-col gap-4 overflow-auto scrollbar-track-offwhite scrollbar-thumb-neutral-500'>
                        {(difficulty === "medium" || difficulty === "hard") && <div className={`flex flex-col ${(!currentPlayer || guessed) ? "" : ""}`}>
                            <button className={`flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 border-solid border-b-0 border-black shadow-lg bg-yellow-500 transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500 ${showBlank ? "select-text" : "cursor-pointer"}`}
                                disabled={!currentPlayer || guessed}
                                onClick={() => {
                                    setShowBlank(true);
                                    if(!showBlank) setPoints(Math.floor(points/2));
                                }}
                            >
                                <div className='absolute top-2 left-2'>
                                    <Lock locked={!showBlank}/>
                                </div>
                                <div className='absolute top-2 right-2 text-[16px]'>
                                    {currentPlayer && !showBlank && <div>{points === 0 ? "No more points!" : <div>-{Math.ceil(points/POINT_FACTOR)}</div>}</div>}
                                </div>
                                {showBlank ? <div className='tracking-widest font-bold text-3xl min-h-18 flex justify-center items-center'>{hiddenName.join("")}</div> : 
                                <div>
                                    <div>Click to reveal:</div>
                                    <div>Fill-in-the-blank</div>
                                </div>}
                            </button>
                            <button className='flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 border-solid [border-top-style:dashed] border-black shadow-lg bg-yellow-500 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500'
                                disabled={!showBlank || !hiddenName.includes("_") || guessed}
                                onClick={revealNextLetter}
                            >
                                <div className='absolute top-2 left-2'>
                                    <Lock locked={!showBlank || !hiddenName.includes("_")}/>
                                </div>
                                <div className='absolute top-2 right-2 text-[16px]'>
                                    {showBlank && <div className='z-10'>{points === 0 ? "" : `-${Math.ceil(points/POINT_FACTOR)}`}</div>}
                                </div>
                                <div>Click to reveal:</div>
                                <div>Next letter</div>
                            </button>
                        </div>}
                        {difficulty === "easy" && <button className='flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 shadow-lg border-black bg-yellow-500 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500'
                            disabled={!currentPlayer || guessed || show50}
                            onClick={()=>{
                                const incorrect = randomFour.filter(option => option !== currentPlayer);
                                incorrect.sort(()=>Math.random()-0.5);
                                setShow50([incorrect[0], incorrect[1]])
                                setPoints(points - Math.floor(currentPlayer.points/2))
                            }}
                        >
                            <div className='absolute top-2 left-2'>
                                <Lock locked={!currentPlayer || guessed || show50}/>
                            </div>
                            <div className='absolute top-2 right-2 text-[16px]'>
                                {show50 && <div className='z-10'>{points === 0 ? "" : `-${Math.ceil(points/POINT_FACTOR)}`}</div>}
                            </div>
                            <div>Click to reveal:</div>
                            <div>50/50</div>
                        </button>}
                        <button className='flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 shadow-lg border-black bg-yellow-500 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500'
                            disabled={!currentPlayer || guessed}
                            onClick={()=>{
                                setShowTeam(true);
                                if(!showTeam) setPoints(points - POINT_FACTOR);
                            }}
                        >
                            <div className='absolute top-2 left-2'>
                                <Lock locked={!showTeam}/>
                            </div>
                            <div className='absolute top-2 right-2 text-[16px]'>
                                {currentPlayer && !showTeam && <div>{points === 0 ? "0" : <div>-{POINT_FACTOR}</div>}</div>}
                            </div>
                            {showTeam ? <div className='flex flex-col gap-2'>
                                <p className='text-blue'>{currentPlayer?.team[0]}</p>
                                {/* <img src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${currentPlayer?.team[1]}.png`}/> */}
                            </div>
                            : <div>
                                <div>Click to reveal:</div>
                                <div>Current team</div>
                            </div>}
                        </button>
                    </ul>

                    <div className='flex flex-col gap-4 mt-auto'>
                        <div 
                            className='text-lg h-min border-2 text-neutral-800 py-4 px-8 w-full text-center bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'
                            onClick={()=>{
                                setModal("settings")
                                setIsOpen(true)
                            }}
                        >
                            Settings
                        </div>
                        <p className='text-neutral-500 text-center'>&copy; {new Date().getFullYear()} WhoDat. All rights reserved.</p>
                    </div>
                    <div
                        className={`${isOpen ? 'flex' : 'hidden'} fixed inset-0 z-50 items-center justify-center bg-black/40`}
                        onClick={()=>setIsOpen(false)}
                    >
                        <div
                            className="flex flex-col relative text-[2cqi] rounded-xl bg-neutral-200 p-8 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {modal === 'settings' && <div className='flex flex-col justify-center gap-6'>
                                <h1 className='underline font-bold'>Settings:</h1>
                                <ul className='list-disc pl-8 flex flex-col justify-center gap-6'>
                                    <li>
                                        <div className='w-full items-center flex gap-4'>
                                            <span className='flex-1'>Autoplay:</span>
                                            <Toggle
                                                enabled={autoplay}
                                                setEnabled={setAutoplay}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div className='w-full items-center flex gap-4'>
                                            <span className='flex-1'>Timer:</span>
                                            <Toggle
                                                enabled={showTimer}
                                                setEnabled={setShowTimer}
                                            />
                                        </div>
                                    </li>
                                    <li className={`transition-all ${showTimer ? "opacity-100" : "opacity-0 -translate-y-5"}`}>
                                        <div className='flex items-center'>
                                            <span>Time:</span>
                                            <input className='mx-4 disabled:cursor-not-allowed' type='range' disabled={!guessed && currentPlayer} min='1000' max='60000' step='1000' value={durationMs} onChange={(e)=>setDurationMs(Number(e.target.value))}></input>
                                            <span className='text-blue-600 text-[1.2cqi]'>{durationMs/1000}s</span>
                                        </div>
                                        {(!guessed && currentPlayer) && <p className='text-red text-[1.1rem] my-1'>*You cannot change the timer mid-round.</p>}
                                    </li>
                                </ul>
                            </div>}
                            <button
                                onClick={()=>setIsOpen(false)}
                                className="cursor-pointer absolute right-4 -top-2 text-[3cqi] text-neutral-500 hover:text-black"
                                title='Close'
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* ===================================================== MOBILE ===================================================== */}
            
            <main className='flex flex-col lg:hidden w-full bg-offwhite'>
                <header className='sticky top-0 left-0 z-99 bg-black w-full'>
                    <div className='flex justify-between items-center p-4 text-offwhite'>
                        <a href="/" className='text-xl font-logo font-bold'>WhoDat?</a>
                        <button
                            className='cursor-pointer'
                            onClick={()=>setIsOpen(!isOpen)}
                        >
                            {isOpen ? <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8 fill-current' viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                            </svg> : 
                            <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8 fill-current' viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>}
                        </button>
                    </div>
                </header>
                {!isOpen && <div
                    className="fixed inset-0 z-98 bg-black/50"
                    onClick={() => setIsOpen(false)}
                />}
                <div className={`fixed z-99 w-80 h-[calc(100vh-64px)] bottom-0 right-0 p-8 text-3xl bg-offwhite transition-all ${isOpen ? "translate-x-full" : ""}`}>
                    <h1 className='font-black mb-8'>Settings</h1>
                    <ul className='flex flex-col justify-center gap-8'>
                        <li>
                            <div className='w-full items-center flex gap-4'>
                                <span className='flex-1'>Autoplay:</span>
                                <Toggle
                                    enabled={autoplay}
                                    setEnabled={setAutoplay}
                                />
                            </div>
                        </li>
                        <li>
                            <div className='w-full items-center flex gap-4'>
                                <span className='flex-1'>Timer:</span>
                                <Toggle
                                    enabled={showTimer}
                                    setEnabled={setShowTimer}
                                />
                            </div>
                        </li>
                        <li className={`transition-all ${showTimer ? "opacity-100" : "opacity-0 -translate-y-5"}`}>
                            <div className='flex items-center'>
                                <span>Time:</span>
                                <input className='mx-4 disabled:cursor-not-allowed' type='range' disabled={!guessed && currentPlayer} min='1000' max='60000' step='1000' value={durationMs} onChange={(e)=>setDurationMs(Number(e.target.value))}></input>
                                <span className='text-blue-600 text-lg'>({durationMs/1000}s)</span>
                            </div>
                            {(!guessed && currentPlayer) && <p className='text-red text-lg my-2'>*You cannot change the timer mid-round.</p>}
                        </li>
                    </ul>
                </div>

                {/* TOP */}
                <section id='guess' className={`flex flex-col min-h-[calc(88vh-64px)] items-center flex-1 scroll-mt-16 bg-blue ${!startGame ? 'pointer-events-none' : ''}`}>
                    <div className='relative flex justify-center items-center w-full'>
                        <button 
                            className='cursor-pointer pointer-events-auto absolute left-2'
                            onClick={()=>{
                                setDifficulty(null);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8 fill-offwhite' viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                            </svg>
                        </button>
                        <div className={`flex flex-col justify-center items-center mx-8 text-offwhite text-4xl w-2/3 font-lg uppercase mt-8 pb-4 mb-4 ${((difficulty === 'easy' && showTimer) || !startGame) ? "border-b-2" : ""}`}>
                            <div>Round {round}</div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        {difficulty === "easy" && 
                        <div className='flex flex-col justify-center items-center w-full gap-4 px-2'>
                            <div className='flex w-full gap-2'> 
                                {showTimer && <div className={`flex flex-1 shrink-0 justify-center items-center border-3 text-2xl py-2 ${((timeLeft.minutes === 0) && (timeLeft.seconds <= 10) && (timeLeft.seconds % 2 == 0) && currentPlayer) ? "bg-red text-white border-black" : "bg-white text-black border-black"}`}>
                                    <Countdown 
                                        durationMs={durationMs} 
                                        timeLeft={timeLeft} 
                                        setTimeLeft={setTimeLeft}
                                        isPaused={isPaused}
                                        remainingMsRef={remainingMsRef}
                                        round={round}
                                    />
                                </div>}
                                {(!autoplay && guessed) && <button 
                                    className={`cursor-pointer text-nowrap shrink-0 group flex flex-1 justify-center items-center text-white text-2xl py-2 bg-blue-950 border-2 border-black transition-all active:scale-95 ${guessed ? 'animate-pulse' : ''}`}
                                    onClick={()=>{
                                        generateFour();
                                        setRound(round + 1);
                                        setIsPaused(false);
                                        setGuessed(false);
                                        setInput("");
                                        setCorrect(false);
                                    }}
                                >
                                    Next Round
                                </button>}
                            </div>
                            
                            <div className='flex flex-col w-full gap-2 border-offwhite'>
                                {randomFour.map((player, i) => (
                                    <button
                                        disabled={guessed || show50.includes(player)}
                                        key={i} 
                                        className={`
                                            p-4 border-2 border-offwhite w-full h-full text-offwhite transition-all active:scale-95 disabled:opacity-40
                                            ${guessed ? "cursor-not-allowed" : "cursor-pointer hover:bg-offwhite hover:text-blue"}
                                            ${guessed && player.name === currentPlayer.name ? "bg-green-500!" : ""}
                                            ${player.name === wrongAnswer ? "bg-red-600! opacity-40" : ""}
                                            ${guessed && player.name !== currentPlayer.name && player.name !== wrongAnswer ? "opacity-40" : ""}
                                            ${show50.includes(player) ? "line-through" : ""}
                                        `}
                                        onClick={()=>handleAnswer(player.name)}
                                    >
                                        <div className={`text-xl font-bold ${hasLoaded ? "" : "invisible"}`}>
                                            {player.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        }

                        {(difficulty === "medium" || difficulty === "hard") && 
                        <div className='flex flex-col justify-center items-center w-full mx-8'>
                            {showTimer && <div className={`flex w-full shrink-0 justify-center items-center border-3 mb-2 text-xl px-4 py-2 ${((timeLeft.minutes === 0) && (timeLeft.seconds <= 10) && (timeLeft.seconds % 2 == 0) && currentPlayer) ? "bg-red text-white border-black" : "bg-white text-black border-black"}`}>
                                <Countdown 
                                    durationMs={durationMs} 
                                    timeLeft={timeLeft} 
                                    setTimeLeft={setTimeLeft}
                                    isPaused={isPaused}
                                    remainingMsRef={remainingMsRef}
                                    round={round}
                                />
                            </div>}
                            <div className='relative border-0 flex items-center w-full text-xl'>
                                <svg className='ml-2 absolute w-6 pointer-events-none fill-neutral-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580t75.5-184.5T380-840t184.5 75.5T640-580q0 44-14 83t-38 69l252 252zM380-400q75 0 127.5-52.5T560-580t-52.5-127.5T380-760t-127.5 52.5T200-580t52.5 127.5T380-400"/></svg>
                                <input 
                                    className={`bg-white w-full h-full border-2 border-b px-10 py-4 outline-0 hover:bg-offwhite not-focus:shadow-xl focus:bg-white! ${guessed ? correct ? "bg-green-500! text-white! border-white border-r-2" : "bg-red! text-white! border-white border-r-2" : ""} ${guessed ? "cursor-not-allowed" : ""}`}
                                    value={input}
                                    disabled={guessed}
                                    ref={inputRef} 
                                    onChange={handleInput} 
                                    onKeyDown={handleKeyDown}
                                    onFocus={()=>setFocused(true)}
                                    onBlur={()=>setFocused(false)}
                                    placeholder='Search by Name...' 
                                    type='text'
                                />
                                {difficulty === "medium" && <ul
                                    className='z-10 absolute top-full left-0 w-full max-h-[33vh] overflow-y-auto scrollbar-track-offwhite scrollbar-thumb-neutral-500'
                                >
                                    {results.map((player, i) => (
                                        <li 
                                            className={`cursor-pointer border-2 border-black p-2 w-full bg-offwhite ${input.toLowerCase() === player.name.toLowerCase() ? "border-l-8 bg-blue-800! text-offwhite" : "hover:bg-blue-800 hover:text-white"} ${focused ? "" : ""}`}
                                            key={i}
                                            tabIndex='0'
                                            ref={(el) => (itemRefs.current[i] = el)}
                                            onKeyDown={handleKeyDown}
                                            onMouseDown={(e)=>e.preventDefault()}
                                            onClick={()=>{
                                                handleAnswer(player.name);
                                            }}
                                        >
                                            {player.name}
                                        </li>
                                    ))}
                                </ul>}
                            </div>
                            <div className='flex w-full'>
                                <button 
                                    className='cursor-pointer shrink-0 group flex flex-1 py-2 justify-center items-center gap-1 bg-offwhite text-lg border-2 border-black hover:bg-neutral-200 active:scale-95'
                                    onClick={()=>{
                                        if(input.length > 0) handleAnswer(input);
                                    }}
                                >
                                    <div>Submit</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                                    </svg>
                                </button>
                                <button 
                                    className={`cursor-pointer shrink-0 group flex flex-1 py-2 justify-center items-center text-white text-lg bg-red border-2 border-black transition-all active:scale-95 ${guessed ? 'animate-pulse' : ''}`}
                                    onClick={()=>{
                                        if(!guessed){
                                            handleAnswer("");
                                        }
                                        else{
                                            generateFour();
                                            setRound(round + 1);
                                            setIsPaused(false);
                                            setGuessed(false);
                                            setInput("");
                                            setCorrect(false)
                                        }
                                    }}
                                >
                                    {guessed ? "Next Round" : 
                                    <div className='flex justify-center items-center gap-1'>
                                        <div>Don't Know</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                        </svg>
                                    </div>}
                                </button>
                            </div>
                        </div>}
                    </div>
                    <div className='flex justify-center flex-1 w-full'>
                        <div className='flex aspect-600/436 border-white overflow-hidden relative'>
                            {!hasLoaded &&
                                <div className='flex justify-center items-center w-full'>
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                                </div>
                            }
                            <img 
                                className={`w-full h-auto object-cover pointer-events-none ${hasLoaded ? 'visible' : 'hidden'} ${startGame ? "" : "brightness-0"}`}
                                src={silhouette}
                                alt='Player'
                                onLoad={()=>setHasLoaded(true)}
                                onError={handleImageError}
                            />
                            {!startGame && <div className='absolute top-[50%] left-[50%] translate-[-50%] pointer-events-auto border-2 border-offwhite bg-black rounded-full'>
                                <button 
                                    className='relative flex justify-center items-center p-5 cursor-pointer'
                                    onClick={()=>setStartGame(true)}
                                >
                                    <div className='text-4xl text-nowrap text-white font-bold font-logo'>Click to Start!</div>
                                </button>
                            </div>}
                        </div>
                    </div>
                </section>

                {/* MID */}
                <section id='hints' className='relative flex flex-col w-full bg-offwhite border-y-2 border-black p-8 gap-4'>
                    <a href='#hints' className='absolute -top-5 left-[50%] translate-x-[-50%] z-9 border-2 text-neutral-800 bg-offwhite/50 rounded-full p-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 fill-current' viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
                        </svg>
                    </a>
                    <h1 className='flex justify-center items-center text-4xl underline'>Hints</h1>
                    <ul className='flex flex-col gap-4 overflow-auto scrollbar-track-offwhite scrollbar-thumb-neutral-500'>
                        {(difficulty === "medium" || difficulty === "hard") && <div className={`flex flex-col ${(!currentPlayer || guessed) ? "" : ""}`}>
                            <button className={`flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 border-solid border-b-0 border-black shadow-lg bg-yellow-500 transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500 ${showBlank ? "select-text" : "cursor-pointer"}`}
                                disabled={!currentPlayer || guessed}
                                onClick={() => {
                                    setShowBlank(true);
                                    if(!showBlank) setPoints(Math.floor(points/2));
                                }}
                            >
                                <div className='absolute top-2 left-2'>
                                    <Lock locked={!showBlank}/>
                                </div>
                                <div className='absolute top-2 right-2 text-[16px]'>
                                    {currentPlayer && !showBlank && <div>{points === 0 ? "No more points!" : <div>-{Math.ceil(points/POINT_FACTOR)}</div>}</div>}
                                </div>
                                {showBlank ? <div className='tracking-widest font-bold text-3xl min-h-18 flex justify-center items-center'>{hiddenName.join("")}</div> : 
                                <div>
                                    <div>Click to reveal:</div>
                                    <div>Fill-in-the-blank</div>
                                </div>}
                            </button>
                            <button className='flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 border-solid [border-top-style:dashed] border-black shadow-lg bg-yellow-500 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500'
                                disabled={!showBlank || !hiddenName.includes("_") || guessed}
                                onClick={revealNextLetter}
                            >
                                <div className='absolute top-2 left-2'>
                                    <Lock locked={!showBlank || !hiddenName.includes("_")}/>
                                </div>
                                <div className='absolute top-2 right-2 text-[16px]'>
                                    {showBlank && <div className='z-10'>{points === 0 ? "" : `-${Math.ceil(points/POINT_FACTOR)}`}</div>}
                                </div>
                                <div>Click to reveal:</div>
                                <div>Next letter</div>
                            </button>
                        </div>}
                        {difficulty === "easy" && <button className='flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 shadow-lg border-black bg-yellow-500 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500'
                            disabled={!currentPlayer || guessed || show50}
                            onClick={()=>{
                                const incorrect = randomFour.filter(option => option !== currentPlayer);
                                incorrect.sort(()=>Math.random()-0.5);
                                setShow50([incorrect[0], incorrect[1]])
                                setPoints(points - Math.floor(currentPlayer.points/2))
                            }}
                        >
                            <div className='absolute top-2 left-2'>
                                <Lock locked={!currentPlayer || guessed || show50}/>
                            </div>
                            <div className='absolute top-2 right-2 text-[16px]'>
                                {show50 && <div className='z-10'>{points === 0 ? "" : `-${Math.ceil(points/POINT_FACTOR)}`}</div>}
                            </div>
                            <div>Click to reveal:</div>
                            <div>50/50</div>
                        </button>}
                        <button className='flex flex-col flex-1 justify-center items-center text-3xl relative text-black p-8 border-2 shadow-lg border-black bg-yellow-500 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-neutral-500'
                            disabled={!currentPlayer || guessed}
                            onClick={()=>{
                                setShowTeam(true);
                                if(!showTeam) setPoints(points - POINT_FACTOR);
                            }}
                        >
                            <div className='absolute top-2 left-2'>
                                <Lock locked={!showTeam}/>
                            </div>
                            <div className='absolute top-2 right-2 text-[16px]'>
                                {currentPlayer && !showTeam && <div>{points === 0 ? "0" : <div>-{POINT_FACTOR}</div>}</div>}
                            </div>
                            {showTeam ? <div className='flex flex-col gap-2'>
                                <p className='text-blue'>{currentPlayer?.team[0]}</p>
                            </div>
                            : <div>
                                <div>Click to reveal:</div>
                                <div>Current team</div>
                            </div>}
                        </button>
                    </ul>
                </section>

                {/* BOTTOM */}
                <section id='details' className='flex flex-col w-full bg-blue p-8 gap-8 text-offwhite'>
                    <div className='grid grid-cols-2 w-full'>
                        <div className='flex flex-col text-3xl gap-2 w-full'>
                            <h1 className='underline font-bold mb-2'>Stats</h1>
                            <div className='flex flex-row'>
                                Streak: {streak}
                                <div className='w-4'>
                                    <div className={`ml-2 animate-bounce ${correct ? '' : 'hidden'}`}>⬆</div>
                                    <div className={`ml-2 animate-bounce ${(guessed && !correct && prevStreak > 0) ? '' : 'hidden'}`}>⬇</div>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                Best: {best}
                            </div>
                            <div className='flex flex-row'>
                                Lives: {"∞"}
                            </div>
                        </div>
                        <div className='flex flex-col text-3xl gap-2 w-full'>
                            <h1 className='underline font-bold mb-2'>Points</h1>
                            <div className='flex flex-row'>
                                Worth: {currentPlayer?.points || 0}
                            </div>
                            <div>Current: {points}</div>
                            <div className='flex flex-row'>
                                Total: {totalPoints}
                            </div>
                        </div>
                    </div>
                    <a href='#guess' className='flex justify-center items-center border-2 p-1 transition-all hover:bg-blue-800 active:scale-98'>Back to Top</a>
                </section>
            </main>
        </div>
    )
}