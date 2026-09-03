import { useState } from 'react'
import Main from './components/Main'
import Start from './pages/Start';
import Game from './pages/Game';
import favicon from '/favicon.svg'
import Hintbar from './components/Hintbar';

function App() {
  // const [enableLives, setEnableLives] = useState(false);
  // const [lives, setLives] = useState(3);
  // const [enableHints, setEnableHints] = useState(false);
  // const [hints, setHints] = useState({
  //   team: true,
  //   position: true,
  //   age: true,
  //   height: true,
  //   college: true,
  //   number: true,
  // })
  // const [enableTime, setEnableTime] = useState(false);
  // const [timeLimit, setTimeLimit] = useState(10);
  const [difficulty, setDifficulty] = useState(null);

  return (
    <div className='flex flex-col h-screen'>
      {/* <Main
        enableLives={enableLives}
        lives={lives}
        enableHints={enableHints}
        hints={hints}
        enableTime={enableTime}
        timeLimit={timeLimit}
        setEnableLives={setEnableLives}
        setLives={setLives}
        setEnableHints={setEnableHints}
        setHints={setHints}
        setEnableTime={setEnableTime}
        setTimeLimit={setTimeLimit}
      /> */}

      <header className='flex items-center bg-black w-full h-16 px-4'>
        <a href='/' className='flex items-center gap-1.5 text-white font-bold text-xl'>
          <img src={favicon} alt='Logo' className='h-8'/>
          <div>WhoDat?</div>
        </a>
      </header>

      {!difficulty ? 
        <Start
          setDifficulty={setDifficulty}
        /> 
        : <Game
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      }
        
    </div>
  )
}

export default App
