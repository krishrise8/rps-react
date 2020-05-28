import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameView from './GameView';
import History from './History';

function App() {
  return (
    <div className="App">
        <GameView Player1Input={''} Player2Input={''} />
        <br/>
        <History name="D"/>
    </div>
  );
}

export default App;
