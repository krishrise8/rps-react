import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameView from './GameView';

function App() {
  return (
    <div className="App">
        <GameView Player1Input={''} Player2Input={''} />
    </div>
  );
}

export default App;
