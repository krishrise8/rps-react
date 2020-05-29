import React from 'react';
import './App.css';
import GameView from './GameView';
import Leaderboard from './Leaderboard'

function App() {
  return (
    <div className="App">
        <GameView Player1Input={''} Player2Input={''} />
        <br/>
        <Leaderboard/>

    </div>
  );
}

export default App;
