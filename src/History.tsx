import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
        <div>
            <h3>History</h3>
            <List component="nav" aria-label="history list">
            {
            allHistory.map((history: { winner: string; }) => 
            <ListItem button>
                <ListItemText primary={history.winner + " wins best of 3"} />
                </ListItem>   
            )
            }
            </List>
        </div>
    )

}

export default History