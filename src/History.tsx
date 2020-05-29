import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment'

type HistoryProps = {
    name: string,
    allHistory: Array<any>
}     
  

const History: React.FC<HistoryProps>= ({name, allHistory}) => {    

    return (
        <div>
            <h3>History</h3>
            <List component="nav" aria-label="history list">
            {
            allHistory.map((history) => 
            <ListItem>
                <ListItemText primary={moment(history.date).format('LLL') + ": " + history.winner + " wins best of 3"} />
            </ListItem>   
            )
            }
            </List>
        </div>
    )

}

export default History