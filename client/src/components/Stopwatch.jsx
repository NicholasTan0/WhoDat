import { useState, useEffect, useRef } from 'react';

export default function Stopwatch({ isRunning }) {
// const [isRunning, setIsRunning] = useState(false);
const [elapsedTime, setElapsedTime] = useState(0);

const intervalRef = useRef(null);
const startTimeRef = useRef(0);

useEffect(() => {
    if (isRunning) {
        startTimeRef.current = Date.now() - elapsedTime;

        intervalRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTimeRef.current);
        }, 50);
    } else clearInterval(intervalRef.current);

    return () => clearInterval(intervalRef.current);
}, [isRunning]);

const formatTime = () => {
    const minutes = Math.floor((elapsedTime / 60000) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

return (
    <div className='text-center flex flex-col'>
        {formatTime()}
        {/* <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setIsRunning(false); setElapsedTime(0); }}>
            Reset
        </button> */}
    </div>
);
}
