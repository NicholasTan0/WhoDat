import { useState } from 'react'
import Game from './pages/Game';
import Title from './pages/Title';

function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [screen, setScreen] = useState("title");

  return (
    <div className="flex flex-col min-h-screen lg:h-screen w-full bg-cover bg-center bg-repeat bg-[url('/background.png')]">
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
