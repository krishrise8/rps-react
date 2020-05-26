import React, { useState } from 'react';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import moment from 'moment'

type InputComponentProps = {
  Player1Input: string
  Player2Input: string
}     


const GameView: React.FC<InputComponentProps> = ({Player1Input, Player2Input}) => {

  const [player1Name, setP1Name] = useState<string>("")
  const [player2Name, setP2Name] = useState<string>("")
  const [player1Choice, setP1Choice] = useState<string>(Player1Input)
  const [player2Choice, setP2Choice] = useState<string>(Player2Input)
  const [roundHistory, setRoundHistory] = useState<Array<string>>([])
  const [p1Error, setP1Error] = useState<string>()
  const [p2Error, setP2Error] = useState<string>()
  const [counter, setCounter] = useState<number>(0)
  const [winner, setWinner] = useState<Map<String, Number>>()
  const [p1Wins, setP1Wins] = useState<number>(0)
  const [p2Wins, setP2Wins] = useState<number>(0)
  const [allHistory, setAllHistory] = useState<Array<string>>([])
  const [draw, setDraw] = useState<boolean>(false)
  const [enterNames, setNames] = useState<boolean>(false)

  
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
        body: JSON.stringify({ player1Name: player1Name, player1Choice: player1Choice.toUpperCase() , player2Name: player2Name, player2Choice : player2Choice.toUpperCase(), roundId: counter})
      };

      await fetch('http://localhost:8080/game/play', requestOptions)
        .then(response => response.json())
        .then(data => {
          RPS(data)
         
        });
    }
  }

  function RPS( data : any){
  
    if(data.winnerNumber !== 0){

      if(p1Wins === 2 || p2Wins === 2){
        bestOfThree(p1Wins, p2Wins)
      }else{
        setDraw(false)
        var round = "Round " + (counter + 1) + ": " + data.winnerName + " wins"
        incrementWinner(data.winnerNumber);
        ((counter === 0) ? (setRoundHistory([round])) : (setRoundHistory([...roundHistory, round])))
        //addDisplayHistory(round)
      }
      setCounter(counter + 1)
    }
    else{
      setDraw(true)
      var round = "Draw. Play Again"
    }
    resetCounter(counter)
    
  }

  function bestOfThree(p1Wins : number, p2Win: number){
    var winner = (p1Wins === 2 ? player1Name : player2Name)
    setRoundHistory([ "Best of three: " + winner + " wins"])
    var historyDate = moment().format('LLL')
    var newHistory = historyDate +  ": "+ winner + " wins Best of 3"
    setAllHistory([...allHistory, newHistory])
    setP1Wins(0)
    setP2Wins(0)

    //save history off 
    saveHistory(historyDate, winner)

    //save winner off
    saveWinner(winner)
  }

  function saveHistory(historyDate : any, winnerText: string){}

  function saveWinner(winnerText: string){}

  
  function resetCounter(counter: number) {
    if (counter === 2) {
      setCounter(0)
    }
  }

  function incrementWinner(winner : number) {
    if (winner === 1) {
      setP1Wins(p1Wins+1)
    }
    if (winner === 2) {
      setP2Wins(p2Wins+1)
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

  function addName(){
    if(player1Name.trim() !== "" && player2Name.trim() !== "" ){
      setNames(true)
    }

  }
  
  return (
    <div> 
        {!enterNames &&
          <div>
            <h3>{"Enter Player 1 and Player 2 Names: "}</h3>
            <div>
              <input type={'text'} value={player1Name} onChange={(e: any) => setP1Name(e.target.value)} />
              <button onClick={addName}> Add </button>
            </div>

            <div>
              <input type={'text'} value={player2Name} onChange={(e: any) => setP2Name(e.target.value)} />
              <button onClick={addName}> Add </button>
            </div>
          </div>
        }

        {enterNames &&
          <div>
            <h3>{player1Name}</h3>
              <input type={'text'} value={player1Choice} onChange={(e: any) => setP1Choice(e.target.value)} />
              <div>{p1Error}</div>

            <h3>{player2Name}</h3>
              <input type={'text'} value={player2Choice} onChange={(e: any) => setP2Choice(e.target.value)} />
              <div>{p2Error}</div>


            <br/>
            <button onClick={score}> Submit </button>
            <br/>
            <div>{ 
              draw ? (<div>Draw. Play Again</div>) : (roundHistory.map(display => <div>{display}</div>))
            }</div>
          </div>
        }

      <br/>
      <div className="dd-wrapper">
        <div className="dd-header">
          <div className="dd-header-title">History</div>
        </div>
        <ul className="dd-list">
          {allHistory.map(history => <li>{history}</li>)}
        </ul>
      </div>

    </div>
  )
}

export default GameView