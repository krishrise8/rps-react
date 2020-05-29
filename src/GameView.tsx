import React, { useState, useEffect } from 'react';
import moment from 'moment'
import History from './History';

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
  const [user, setUser] = useState<string>("")

  

  
  enum choices{
    'ROCK', 'PAPER', 'SCISSORS'
  }

  useEffect(() => {


    fetch('http://localhost:8080/game/username')
    .then(response => response.text())
    .then(data => {
        console.log(data)
        setUser(data)
        return fetch('http://localhost:8080/game/getHistory/' + data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        setAllHistory([...allHistory, ...data])
    })
    .catch(error => console.log('Request failed', error));
  
  }, [])


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
    var player1wins : number = 0;
    var player2wins : number = 0;
    // if there's no draw
    if(data.winnerNumber !== 0){
      incrementWinner(data.winnerNumber);
      if (data.winnerNumber === 1) {
        player1wins = p1Wins + 1
        setP1Wins(p1Wins+1)
      }
      if (data.winnerNumber === 2) {
        player2wins = p2Wins + 1
        setP2Wins(p2Wins+1)
      }
      // if player 1 or player 2 has won twice
      if(player1wins === 2 || player2wins === 2){
        // does best of three stuff: displays winner, saves history
        bestOfThree(player1wins, player2wins)
        // resets the round counter to zero
        setCounter(0)

        // no best of three winner yet
      }else{
        setDraw(false)
        var round = "Round " + (counter + 1) + ": " + data.winnerName + " wins";
        ((counter === 0) ? (setRoundHistory([round])) : (setRoundHistory([...roundHistory, round])))
        setCounter(counter + 1)
      }
    }
    // there was a draw
    else{
      setDraw(true)
      var round = "Draw. Play Again"
    }
    
  }

  /**
   * In the round results: "Best of three.." and saves the history to
   * allHistory.
   * @param p1Wins
   * @param p2Win
   */
  function bestOfThree(p1Wins : number, p2Win: number){
    var winner = (p1Wins === 2 ? player1Name : player2Name)
    setRoundHistory([ "Best of three: " + winner + " wins"])
    var historyDate = moment().format('LLL')
    var dateObj = moment(historyDate).unix()*1000
    console.log("Date object  " + dateObj)
    var newHistory = historyDate +  ": "+ winner + " wins Best of 3"
    console.log(newHistory)
    saveHistory(dateObj, winner)
    setAllHistory([...allHistory, newHistory])
    console.log("allHistory" + allHistory)
    setP1Wins(0)
    setP2Wins(0)

    console.log("history date " + historyDate)

    //save winner off
    saveLeaderboard(winner)
  }

  function saveHistory(historyDate : any, winner: string){

    const requestOptions = {
      method: 'POST',
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({id: 0, playerOne: player1Name, playerTwo: player2Name, winner: winner, date: historyDate})
    };

    fetch('http://localhost:8080/game/saveHistory', requestOptions)
      .then(response => response.json())
      .then(data => {
          console.log('fetch save History' + data)
      });

  }

  function saveLeaderboard(winnerName: string){

    fetch('http://localhost:8080/game/saveLeaderboard/' + winnerName)
    .then(response => response.json())
    .then(data => {
        console.log(data)
    });
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
            </div>
            <div>
              <input type={'text'} value={player2Name} onChange={(e: any) => setP2Name(e.target.value)} />
            </div>
            <button onClick={addName}> Add </button>
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
        <History name={user} allHistory={allHistory}/>
    </div>
  )
}

export default GameView