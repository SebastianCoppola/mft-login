import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import SnackBar from './components/SnackBar'

const App = ({ onLogOut }) => {

    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: ''})

    console.log("Hello World from Dashboard App.js")

    const handleLogOut = () => {
        if(onLogOut) onLogOut()
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Header onLogOut={handleLogOut} setSnackbar={setSnackbar}/>
            </Grid>
            <Grid item xs={12}>
                <Dashboard setSnackbar={setSnackbar}/>
            </Grid>
            <SnackBar
                open={snackbar.open}
                onClose={()=>setSnackbar({open:false})}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Grid>
    )
}

export default App