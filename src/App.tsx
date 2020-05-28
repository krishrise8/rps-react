import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameView from './GameView';
import History from './History';
import Leaderboard from './Leaderboard'

function App() {
  return (
    <div className="App">
        <GameView Player1Input={''} Player2Input={''} />
        <br/>
        <History name="D"/>
        <br/>
        <Leaderboard name="A"/>

    </div>
  );
}

export default App;
