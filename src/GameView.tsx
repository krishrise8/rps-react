import React, { useState } from 'react';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

type InputComponentProps = {
  Player1Input: string
  Player2Input: string
}     


const GameView: React.FC<InputComponentProps> = ({Player1Input, Player2Input}) => {
  var p1Wins : number = 0
  var p2Wins : number = 0

  const [player1Choice, setP1Choice] = useState<string>(Player1Input)
  const [player2Choice, setP2Choice] = useState<string>(Player2Input)
  const [result, sendResult] = useState<number>()
  const [displayHistory, setDisplayHistory] = useState<Array<string>>([])
  const [p1Error, setP1Error] = useState()
  const [p2Error, setP2Error] = useState<string>()
  const [counter, setCounter] = useState<number>(0)
  const [key, setKey] = useState<number>(0)
  const [allHistory, setAllHistory] = useState<Map<Number, String>>(new Map())
  const [draw, setDraw] = useState<boolean>(false)


  
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
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({ player1Choice: player1Choice.toUpperCase() , player2Choice : player2Choice.toUpperCase(), roundId: counter})
      };

      await fetch('http://localhost:8080/game/play', requestOptions)
        .then(response => response.json())
        .then(data => {
          //setRPSResults(data)
          RPS(data)
         
        });
    }
  }

  function RPS( data : any){
       
    //setKey(key+1)
    //sendResult(data.winner)
    resetDisplayHistory()
  
    if(data.winner !== 0){
      setDraw(false)
      var round = "Round " + (counter + 1) + ": Player " + data.winner + " wins"
      incrementWinner(data.winner)
      addDisplayHistory(round)
      setCounter(counter + 1)
      //addAllHistory(round)
          }

    else{
      setDraw(true)
      var round = "Draw. Play Again"
      //addAllHistory(round)
    }
    resetCounter(counter)
  }

  
  function resetCounter(counter: number) {
    if (counter === 2) {
      setCounter(0)
    }
  }

  function resetDisplayHistory() {
    if (counter === 0) {
      setDisplayHistory([])
    }
  }
  
  function addAllHistory(round : string){
    setAllHistory(allHistory.set(key, round))
  }

  function addDisplayHistory(round : string){
    // displayHistory.push(round)
    setDisplayHistory([...displayHistory, round])
  }

  function incrementWinner(winner : number) {
    if (winner === 1) {
      p1Wins++
    }
    if (winner === 2) {
      p2Wins++
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
    <div> 
      <h3> Player 1</h3>
      <input type={'text'} value={player1Choice} onChange={(e: any) => setP1Choice(e.target.value)} />
      <div>{p1Error}</div>
      <h3> Player 2</h3>
      <input type={'text'} value={player2Choice} onChange={(e: any) => setP2Choice(e.target.value)} />
      <div>{p2Error}</div>
      <br/>
      <button onClick={score}> Submit </button>
      <div>{ 
      draw ? (<div>Draw. Play Again</div>) : (displayHistory.map(display => <div>{display}</div>))
      }</div>
    </div>
  )
}

export default GameView