import { useState, useEffect, useRef } from 'react'
import Stopwatch from '../components/Stopwatch';
import Countdown from '../components/Countdown';

export default function Game({ difficulty, setDifficulty }) {
    const inputRef = useRef(null);
    const itemRefs = useRef([]);

    const [allPlayers, setAllPlayers] = useState([]);
    const [randomFour, setRandomFour] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [silhouette, setSilhouette] = useState('/src/assets/silhouette.png');
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
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(60000));
    const [isPaused, setIsPaused] = useState(false);
    const [letterIndex, setLetterIndex] = useState(0);
    const [showBlank, setShowBlank] = useState(false);

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
        if(currentPlayer && timeLeft.expired === true){
            handleAnswer("");
        }
    }, [timeLeft.expired])

    useEffect(()=>{
        inputRef.current?.focus();
    }, [guessed])

    useEffect(() => {
        if (index >= 0 && itemRefs.current[index]) {
            itemRefs.current[index].scrollIntoView({
                block: "nearest",
            });
        }
    }, [index]);

    useEffect(()=>{
        if(allPlayers.length >= 4){
            generateFour()
        }
    }, [allPlayers])

    useEffect(() => {
        if (randomFour.length < 4) return;
        const player = randomFour[Math.floor(Math.random() * randomFour.length)];
        setCurrentPlayer(player);
        setSilhouette(`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.id}.png`);
    }, [randomFour]);

    const handleInput = (e) => {
        setInput(e.target.value);
        if(!e.target.value) {
            setResults([]);
            return;
        }
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
            else{   //difficulty is medium
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
        // Normalize accents, case, and whitespace
        const normalize = (str) =>
            str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();

        const user = normalize(userInput);
        const correct = normalize(correctAnswer);

        // Exact match
        if (user === correct) return true;

        /*
        * Remove periods from both strings.
        * This makes periods optional.
        *
        * "A.J. Dybantsa" -> "AJ Dybantsa"
        * "AJ Dybantsa"   -> "AJ Dybantsa"
        */
        const userNoPeriods = user.replace(/\./g, "");
        const correctNoPeriods = correct.replace(/\./g, "");

        // If they don't match without periods, it's wrong.
        if (userNoPeriods !== correctNoPeriods) {
            return false;
        }

        /*
        * At this point, the only difference between the two
        * strings should be periods.
        *
        * Check that every period the user entered exists in
        * the same position as a period in the correct answer.
        */
        for (let i = 0; i < user.length; i++) {
            if (user[i] === ".") {
                if (correct[i] !== ".") {
                    return false;
                }
            }
        }

        // Also make sure the user didn't omit a character in
        // a way that causes the positions to shift.
        let userIndex = 0;

        for (let correctIndex = 0; correctIndex < correct.length; correctIndex++) {
            if (correct[correctIndex] === ".") {
                // Period is optional, so don't require it
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

    const handleAnswer = (name) => {
        setInput(currentPlayer.name);
        setGuessed(true);
        setIsPaused(true);
        setResults([]);
        setIndex(-1);
        setLetterIndex(1);
        if(isCorrect(name, currentPlayer.name)){
            setCorrect(true);
            setPrevStreak(streak)
            setStreak(streak + 1)
            setTimeout(() => {
                setInput("");
                setCorrect(false);
                setRound(round + 1);
                setGuessed(false);
                setWrongAnswer(null);
                setIsPaused(false);
                generateFour();
            }, 1000); 
        }
        else {
            setWrongAnswer(name);
            endStreak();
            // setInput(currentPlayer.name)
            setTimeout(() => {
                setInput("");
                setRound(round + 1);
                setGuessed(false);
                setIsPaused(false);
                generateFour();
                setWrongAnswer(null);
            }, 1000); 
        }
    }

    return(
        <main className='flex flex-row flex-1 min-h-0'>
            {/* LEFT */}
            <section className='flex flex-col w-1/5 border-r-3 bg-offwhite p-8 gap-8'>
                <button 
                    className='flex justify-center items-center w-min cursor-pointer hover:animate-bounce-horizontal'
                    title='Go Back'
                    onClick={()=>setDifficulty(null)}
                >
                    <svg className='w-8 h-8' viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                </button>
                <div className='flex relative gap-8 text-black px-8 py-12 border-2 shadow-lg border-black bg-yellow-500 invisible'>
                    <div className='absolute size-4 top-2 left-2 rounded-full bg-white border-black border-2'/>
                    <div className='flex flex-col justify-center items-center text-5xl gap-8 w-full'>
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
                    </div>
                </div>
                <div className='flex flex-col gap-4 mt-auto'>
                    <div className='text-lg h-min border-2 text-neutral-800 rounded-full py-4 px-8 w-full text-center bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'>How to Play</div>
                    <div className='text-lg h-min border-2 text-neutral-800 rounded-full py-4 px-8 w-full text-center bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'>Settings</div>
                    {/* <div className='text-lg h-min border-2 text-neutral-800 rounded-full py-4 px-8 w-full text-center bg-white hover:underline hover:bg-offwhite active:scale-95 cursor-pointer transition-all'>Learn More</div> */}
                </div>
            </section>

            {/* MIDDLE */}
            {/* bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-size-[32px_32px] */}
           <section className='relative flex flex-col items-center flex-1 bg-blue'>
                <div className='flex justify-center items-center w-full'>
                    <div className='flex justify-center items-center mx-8 text-white text-5xl w-2/3 font-lg uppercase border-b-2 mt-8 pb-4 mb-4'>
                        <div>Round {round}</div>
                        {/* <div>&nbsp;-&nbsp;</div>
                        <div className='flex text-red-500 tracking-widest'>❤︎⁠❤︎⁠❤︎⁠</div> */}
                    </div>
                </div>
                <div className='flex justify-center items-center w-full my-4'>
                    {difficulty === "easy" && 
                    <div className='grid grid-cols-2 grid-rows-2 w-full mx-8 gap-3'>
                        {randomFour.map((player, i) => (
                            <button
                                disabled={guessed}
                                key={i} 
                                className={`
                                    p-4 border-2 border-white w-full h-full text-offwhite transition-all active:scale-95
                                    ${guessed ? "cursor-not-allowed" : "cursor-pointer hover:bg-offwhite hover:text-blue"}
                                    ${guessed && player.name === currentPlayer.name ? "bg-green-500!" : ""}
                                    ${player.name === wrongAnswer ? "bg-red-600! opacity-40" : ""}
                                    ${guessed && player.name !== currentPlayer.name && player.name !== wrongAnswer ? "opacity-40" : ""}
                                `}
                                onClick={()=>handleAnswer(player.name)}
                            >
                                <div className={`text-4xl font-bold ${hasLoaded ? "" : "invisible"}`}>
                                    {player.name}
                                </div>
                            </button>
                        ))}
                    </div>
                    }

                    {(difficulty === "medium" || difficulty === "hard") && 
                    <div className='flex w-2/3 mx-8'>
                        {showTimer && <div className={`flex mr-2 w-24 shrink-0 justify-center items-center border-2 text-2xl px-4 ${(timeLeft.minutes === 0) && (timeLeft.seconds <= 10) && (timeLeft.seconds % 2 == 0) ? "bg-red text-white border-black" : "bg-white text-black border-black"}`}>
                            <Countdown 
                                durationMs={60000} 
                                timeLeft={timeLeft} 
                                setTimeLeft={setTimeLeft}
                                isPaused={isPaused}
                                key={round}
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
                                className='absolute top-full left-0 w-full max-h-[33vh] mt-1 overflow-y-auto scrollbar-track-offwhite scrollbar-thumb-neutral-500'
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
                            title='Submit'
                            onClick={()=>{
                                if(input.length > 0) handleAnswer(input);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                            </svg>
                        </button>
                        <button 
                            className='cursor-pointer shrink-0 group flex justify-center items-center px-4 bg-red ml-2 border-2 border-black'
                            // title='Give Up?'
                            onClick={()=>{
                                handleAnswer("");
                                // if(confirm("Are you sure you want to give up?")) handleAnswer("");
                            }}
                        >
                            <div className='text-white text-2xl'>Give Up?</div>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 250 352" className='rotate-20 w-8 h-auto group-hover:animate-rock'>
                                <path className="stroke-current text-black" strokeWidth="21" strokeLinecap="round" fill="none" d="M42 327l0 -291" />
                                <path className="fill-white stroke-current text-black" strokeWidth="10" strokeLinejoin="round" d="M49 50c70,30 104,28 178,2 -21,42 -21,74 0,116 -72,25 -101,25 -178,0l0 -118z" />
                            </svg> */}
                        </button>
                    </div>
                    }
                </div>
                <div className='flex justify-center flex-1 w-full'>
                    <div className='flex aspect-600/436 w-auto h-full border-white overflow-hidden'>
                        {!hasLoaded &&
                            <div className='flex justify-center items-center w-full'>
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                            </div>
                        }
                        <img 
                            className={`w-full h-auto object-cover ${hasLoaded ? 'visible' : 'hidden'}`}
                            src={silhouette}
                            alt='Player'
                            onLoad={()=>setHasLoaded(true)}
                            onError={handleImageError}
                        />
                    </div>
                </div>
            </section>
            
            {/* RIGHT */}
            <section className='flex flex-col w-1/5 border-l-3 bg-offwhite p-8 gap-8'>
                <div className='flex justify-center items-center h-8 text-4xl underline'>
                    Hints
                </div>
                <ul className='flex flex-col gap-4'>
                    <button className='flex flex-col justify-center items-center text-3xl relative text-black p-8 border-2 shadow-lg border-black bg-yellow-500 cursor-pointer'
                        onClick={() => {setShowBlank(!showBlank)}}
                    >
                        <div className='absolute top-2 left-2'>
                            <svg className='w-8 h-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M226.67-636h380v-90.67q0-52.77-36.92-89.72-36.93-36.94-89.67-36.94-52.75 0-89.75 36.94-37 36.95-37 89.72h-66.66q0-80.33 56.57-136.83Q399.81-920 480.07-920q80.26 0 136.76 56.55 56.5 56.55 56.5 136.78V-636h60q27.5 0 47.09 19.58Q800-596.83 800-569.33v422.66q0 27.5-19.58 47.09Q760.83-80 733.33-80H226.67q-27.5 0-47.09-19.58Q160-119.17 160-146.67v-422.66q0-27.5 19.58-47.09Q199.17-636 226.67-636Zm0 489.33h506.66v-422.66H226.67v422.66Zm308.5-155.85Q558-325.04 558-356.67q0-31-22.95-55.16Q512.11-436 479.89-436t-55.06 24.17Q402-387.67 402-356.33q0 31.33 22.95 53.83 22.94 22.5 55.16 22.5t55.06-22.52Zm-308.5 155.85v-422.66 422.66Z"/></svg>
                        </div>
                        <div>Click to reveal:</div>
                        <div>Fill-in-the-blank</div>
                        <div className='tracking-widest'>{showBlank && Array.from(currentPlayer.name).map((letter, i) => /^[a-zA-Z]$/.test(letter) ? "_" : letter)}</div>
                    </button>
                    <button className='flex flex-col justify-center items-center text-3xl relative text-black p-8 border-2 shadow-lg border-black bg-yellow-500 cursor-pointer'
                        onClick={() => {
                            if (letterIndex >= currentPlayer.name.length) return;

                            const nextIndex =
                                currentPlayer.name[letterIndex] === " "
                                    ? letterIndex + 2
                                    : letterIndex + 1;

                            setInput(currentPlayer.name.slice(0, nextIndex));
                            setLetterIndex(nextIndex);
                        }}
                    >
                        <div className='absolute top-2 left-2'>
                            <svg className='w-8 h-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M226.67-80q-27.5 0-47.09-19.58Q160-119.17 160-146.67v-422.66q0-27.5 19.58-47.09Q199.17-636 226.67-636h60v-90.67q0-80.23 56.57-136.78T480.07-920q80.26 0 136.76 56.55 56.5 56.55 56.5 136.78V-636h60q27.5 0 47.09 19.58Q800-596.83 800-569.33v422.66q0 27.5-19.58 47.09Q760.83-80 733.33-80H226.67Zm0-66.67h506.66v-422.66H226.67v422.66Zm308.5-155.85Q558-325.04 558-356.67q0-31-22.95-55.16Q512.11-436 479.89-436t-55.06 24.17Q402-387.67 402-356.33q0 31.33 22.95 53.83 22.94 22.5 55.16 22.5t55.06-22.52ZM353.33-636h253.34v-90.67q0-52.77-36.92-89.72-36.93-36.94-89.67-36.94-52.75 0-89.75 36.94-37 36.95-37 89.72V-636ZM226.67-146.67v-422.66 422.66Z"/></svg>
                        </div>
                        <div>Click to reveal:</div>
                        <div>A letter</div>
                    </button>
                </ul>
            </section>
        </main>
    )
}