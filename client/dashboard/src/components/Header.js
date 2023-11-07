import React from 'react'
import { Grid, Typography, Button, makeStyles } from '@material-ui/core'
import { BASE_URL, URL_LOGOUT } from '../../utils/urls'
import { getCookie, deleteCookie } from '../../utils/helpers'

const useStyles = makeStyles({
    header:{
        background: '#E4E6E3',
        padding:'30px 30px',
        magin:0
    },
    logo1:{
        fontSize:'40px',
        fontWeight:'700',
        color:'#505050',
        letterSpacing:'2px',
        margin: 0,
        padding: 0,

    },
    logo2:{
        fontSize:'15px',
        fontWeight:'700',
        color:'#505050',
        margin: 0,
        padding: 0,
    }, 
    button:{
        background:'#0876FC',
        padding:'5px 10px',
        border:'1px solid #ffff',
        color:'#fff',
        fontWeight:'700'
    }
})

const Header = ({ onLogOut, setSnackbar }) => {
    
    const classes = useStyles()

    const handleLogout = () => {
        if(getCookie('token')){
            fetch(`${BASE_URL}${URL_LOGOUT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${getCookie('token')}`
                }
            })
            .then( res => {
                if(res.status === 200) {
                    deleteCookie('token')
                    onLogOut()
                }else{
                    setSnackbar({open: true, message: 'An error occurred when trying to log you out.', severity: 'error'})
                }
            })
            .catch( () => {
                setSnackbar({open: true, message: 'An error occurred when trying to log you out.', severity: 'error'})
            })
        }else{
            onLogOut()
        }
    }

    return (
        <Grid container justifyContent='space-between' alignItems='center' className={classes.header}>
            <Grid item style={{textAlign:'center'}}>
                <Typography className={classes.logo1}>LOGIN</Typography>
                <Typography className={classes.logo2}>MICROFRONTEND</Typography>
            </Grid> 
            <Grid item style={{padding:0, margin:0}}>
                <Button variant='outlined' onClick={handleLogout} className={classes.button}>
                    <Typography>LOGOUT</Typography>
                </Button>
            </Grid> 
        </Grid>
    )
}

export default Header