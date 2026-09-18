import { useState } from 'react'
import Game from './pages/Game';
import Title from './pages/Title';

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [screen, setScreen] = useState("title");

  return (
    <div className="flex flex-col h-screen bg-cover bg-center bg-no-repeat bg-[url('src/assets/background.png')]">
      {!difficulty ? 
        <Title
          setDifficulty={setDifficulty}
          screen={screen}
          setScreen={setScreen}
        /> :
        <Game
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />}
    </div>
  )
}

export default App
