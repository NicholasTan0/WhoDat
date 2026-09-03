import { useEffect, useRef } from "react";

const Countdown = ({ durationMs, timeLeft, setTimeLeft, isPaused }) => {
  const endTimeRef = useRef(null);
  const timerRef = useRef(null);
  const remainingMsRef = useRef(durationMs); // Tracks leftover ms when paused

  const formatTimeLeft = (difference) => {
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  };

  useEffect(() => {
    // 1. If paused, clear the interval and stop updating
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return; 
    }

    // 2. If resuming or starting fresh, calculate a new absolute end time
    endTimeRef.current = Date.now() + remainingMsRef.current;

    timerRef.current = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      
      // 3. Keep updating our hidden backup of the exact time left
      remainingMsRef.current = Math.max(0, remaining); 

      const updatedTime = formatTimeLeft(remaining);
      
      setTimeLeft((prevTime) => {
        if (prevTime && prevTime.seconds === updatedTime.seconds && !updatedTime.expired) {
          return prevTime; 
        }
        return updatedTime;
      });

      if (updatedTime.expired) {
        clearInterval(timerRef.current);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [durationMs, setTimeLeft, isPaused]); // Added isPaused as a dependency

  if (!timeLeft) return <span>Loading timer...</span>;

  return (
    <div className="tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}</div>
  );
};

export default Countdown;



// import React, { useState, useEffect, useRef } from 'react';

// const ControllableCountdown = ({ durationMs }) => {
//   // Track remaining milliseconds in state
//   const [timeRemaining, setTimeRemaining] = useState(durationMs);
//   const [isActive, setIsActive] = useState(false);
  
//   const timerRef = useRef(null);
//   const lastTickRef = useRef(null);

//   // Reset the timer if the initial durationMs prop changes
//   useEffect(() => {
//     setTimeRemaining(durationMs);
//     setIsActive(false);
//   }, [durationMs]);

//   useEffect(() => {
//     if (isActive && timeRemaining > 0) {
//       // Capture the exact start of this active period
//       lastTickRef.current = Date.now();

//       timerRef.current = setInterval(() => {
//         const now = Date.now();
//         const elapsed = now - lastTickRef.current;
//         lastTickRef.current = now; // Update anchor for the next tick

//         setTimeRemaining((prev) => {
//           const nextTime = prev - elapsed;
//           if (nextTime <= 0) {
//             clearInterval(timerRef.current);
//             setIsActive(false);
//             return 0;
//           }
//           return nextTime;
//         });
//       }, 100); // Ticking faster (100ms) keeps the UI responsive when pausing
//     }

//     return () => clearInterval(timerRef.current);
//   }, [isActive]);

//   // Control Handlers
//   const handleTogglePlay = () => setIsActive(!isActive);
  
//   const handleReset = () => {
//     setIsActive(false);
//     setTimeRemaining(durationMs);
//   };

//   // Time Formatting Helper
//   const formatTime = (ms) => {
//     const totalSeconds = Math.floor(ms / 1000);
//     const days = Math.floor(totalSeconds / (3600 * 24));
//     const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     return {
//       days,
//       hours: hours.toString().padStart(2, '0'),
//       minutes: minutes.toString().padStart(2, '0'),
//       seconds: seconds.toString().padStart(2, '0'),
//     };
//   };

//   const time = formatTime(timeRemaining);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', fontFamily: 'monospace' }}>
//       {/* Display */}
//       <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
//         {timeRemaining === 0 ? (
//           <span>Time's up!</span>
//         ) : (
//           <>
//             {time.days > 0 && `${time.days}d : `}
//             {time.hours}h : {time.minutes}m : {time.seconds}s
//           </>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div style={{ display: 'flex', gap: '10px' }}>
//         <button 
//           onClick={handleTogglePlay} 
//           disabled={timeRemaining === 0}
//           style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
//         >
//           {isActive ? 'Pause' : 'Start'}
//         </button>
        
//         <button 
//           onClick={handleReset}
//           style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ControllableCountdown;
