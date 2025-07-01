import { useState } from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main'

function App() {
  const [enableLives, setEnableLives] = useState(false);
  const [lives, setLives] = useState(3);
  const [enableHints, setEnableHints] = useState(false);
  const [hints, setHints] = useState({
    team: true,
    position: true,
    age: true,
    height: true,
    college: true,
    number: true,
  })
  const [enableTime, setEnableTime] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10);

  return (
    <>
      <Header 
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
      />
      <Main
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
      />
      <Footer/>
    </>
  )
}

export default App
