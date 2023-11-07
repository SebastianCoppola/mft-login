import React from 'react'
import { CircularProgress, Backdrop, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1300,
        color: '#fff',
    } 
}))

const Loader = ({ loading }) => {
    
    const classes = useStyles()
    
    return (
        <Backdrop open={loading} className={classes.backdrop} >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loader