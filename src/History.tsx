import React, { useEffect, useState } from 'react';

type HistoryProps = {
    name: String
}     
  

const History: React.FC<HistoryProps>= ({name}) => {

const [allHistory, setAllHistory] : any[] = useState<Array<any>>([])

     useEffect(() => {
        fetch('http://localhost:8080/game/getHistory/' + name)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setAllHistory([...allHistory, ...data])
        });
        }, [])

    

    return (
        <div className="dd-wrapper">
        <div className="dd-header">
          <div className="dd-header-title">History</div>
        </div>
        <ul className="dd-list">
          {
          allHistory.map((history: { winner: string; }) => <li>{history.winner + " wins best of 3"}</li>)
          }
        </ul>
      </div>
    )

}

export default History