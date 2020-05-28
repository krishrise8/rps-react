import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';



type LeaderboardProps = {
    name: String
}     
  

const Leaderboard: React.FC<LeaderboardProps>= ({name}) => {

const [allLeaderBoard, setLeaderboard] = useState<Array<any>>([])

     useEffect(() => {
        fetch('http://localhost:8080/game/getLeaderboard')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setLeaderboard([...allLeaderBoard, ...data])
        });
        }, [])


    const useStyles = makeStyles({
          root: {
            width: "100%"
        },
        paper: {
            width: "100%",
            overflowX: "auto",
            margin: "auto",
            alignItems: "center",
            justifyContent: 'center'
          },
        table: {
            margin: "auto",
            maxWidth: 200,
        },
        });
          
        
    const classes = useStyles();
    

    return (
        <div className= {classes.root}>
        <h3>Leaderboard</h3>
        <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Games Won</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {allLeaderBoard.map((row) => (
                <TableRow key={row.user}>
                    <TableCell component="th" scope="row">
                    {row.user}
                    </TableCell>
                    <TableCell align="right">{row.games}</TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
      </Paper>
      </div>
    )

}

export default Leaderboard