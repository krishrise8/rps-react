import React, { useState } from 'react';

type InputComponentProps = {
  Player1Input: string
  Player2Input: string
}     


const GameView: React.FC<InputComponentProps> = ({Player1Input, Player2Input}) => {
  var counter: number = 1
  var p1Wins : number = 0
  var p2Wins : number = 0

  const [player1Choice, setP1Choice] = useState<string>(Player1Input)
  const [player2Choice, setP2Choice] = useState<string>(Player2Input)
  const [rpsResults, setRPSResults] = useState()
  const [rpsHistory, setRPShistory] = useState({ rpsResults })
  const [p1Error, setP1Error] = useState()
  const [p2Error, setP2Error] = useState<string>()
  
  enum choices{
    'ROCK', 'PAPER', 'SCISSORS'
  }

  async function score() {

    setP1Error('')
    setP2Error('')
    setP1Choice('')
    setP2Choice('')

    let validChoices = handleValidation(player1Choice, player2Choice)

    if(validChoices){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': 'true'},
        body: JSON.stringify({ player1Choice: player1Choice.toUpperCase() , player2Choice : player2Choice.toUpperCase()})
      };

      await fetch('http://localhost:8080/game/play', requestOptions)
        .then(response =>  response.json())
        .then(data => {
         
          //setRPSResults(data)
          roundCounter(counter, data)
         
        });

    }
  }

  function roundCounter(counter : number, data : any){
    var round = "Round " + data.roundId + ": Player" + data.winner + "wins"
    setRPSResults(round)
    incrementWinner(data.winner)
    resetCounter(counter)

  }
  function resetCounter(counter: number) {
    if (counter === 3) {
      //setRPShistory(data)
      counter = 1
    }
  }
  function incrementWinner(winner : number) {
    if (winner === 1) {
      p1Wins++
    }
    if (winner === 2) {
      p2Wins++
    }
    if (winner !== 0) {
      counter++
    }
  }
  function handleValidation(player1Choice : string, player2Choice : string){

    if(!(player1Choice.toUpperCase() in choices)){
      setP1Error('Invalid throw - must be rock, paper, or scissors')
    }

    if(!(player2Choice.toUpperCase() in choices)){
      setP2Error('Invalid throw - must be rock, paper, or scissors')
    }

    if(player1Choice === ""){
      setP1Error('Required')
    }

    if(player2Choice === ""){
      setP2Error('Required')
    }

    return (player1Choice.toUpperCase() in choices) && (player2Choice.toUpperCase() in choices)
    
  }
  
  return (
    <div> {Player1Input}{Player2Input}
      <h3> Player 1</h3>
      <input type={'text'} value={player1Choice} onChange={(e: any) => setP1Choice(e.target.value)} />
      <div>{p1Error}</div>
      <h3> Player 2</h3>
      <input type={'text'} value={player2Choice} onChange={(e: any) => setP2Choice(e.target.value)} />
      <div>{p2Error}</div>
      <br/>
      <button onClick={score}> Submit </button> 
      <h3>{rpsResults}</h3>
    </div>
  )
}

export default GameView