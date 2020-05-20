import React, { useState } from 'react';

type InputComponentProps = {
  Player1Input: string
  Player2Input: string
}     


const GameView: React.FC<InputComponentProps> = ({Player1Input, Player2Input}) => {

  const [player1Choice, setP1Choice] = useState<string>(Player1Input)
  const [player2Choice, setP2Choice] = useState<string>(Player2Input)
  const [rpsResults, setRPSResults] = useState()

  enum choices{
     'ROCK',
     'PAPER',
     'SCISSORS'
  }

  async function score() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': 'true'},
      body: JSON.stringify({ player1Choice: player1Choice , player2Choice : player2Choice})
    };

    await fetch('http://localhost:8080/game/play', requestOptions)
      .then(response =>  response.text())
      .then(data => setRPSResults(data));
    
  }
  
  return (
    <div> {Player1Input}{Player2Input}
      <h3> Player 1</h3>
      <input type={'text'} value={player1Choice} onChange={(e: any) => setP1Choice(e.target.value)} />
      <h3> Player 2</h3>
      <input type={'text'} value={player2Choice} onChange={(e: any) => setP2Choice(e.target.value)} />
      <br/>
      <button onClick={score}> Submit </button> 
      <h3>{rpsResults}</h3>
    </div>
  )
}

export default GameView