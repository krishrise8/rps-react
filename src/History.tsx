import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';

type HistoryProps = {
    name: string,
    allHistory: Array<any>
}     
  

const History: React.FC<HistoryProps>= ({name, allHistory}) => { 
    
    const [displayHistory, setAllHistory] = useState<Array<any>>(allHistory)


    const useStyles = makeStyles({
        root: {
            width: "100%",
        },
      list: {
          width: "100%",
          overflowX: "auto",
          margin: "auto",
        },
        listitem: {
            margin: "auto",
            maxWidth: 500,
          },
          listitemtxt: {
            margin: "auto",
            textAlign: "center",
          }
      });
        
      
  const classes = useStyles();


    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
  
      fetch('http://localhost:8080/game/getHistory/'+ name)
      .then(response => response.json())
      .then(data => {
          console.log(data)
          setAllHistory([...data])
      })
      .catch(error => console.log('Request failed', error));
    });

    return (
        <div className={classes.root}>
            <h3>History</h3>
            <List className={classes.list} component="nav" aria-label="history list">
            {
            displayHistory.map((history) => 
            <ListItem className={classes.listitem}>
                <ListItemText className={classes.listitemtxt} primary={moment(history.date).format('LLL') + ": " + history.winner + " wins best of 3"} />
            </ListItem>   
            )
            }
            </List>
        </div>
    )

}

export default History