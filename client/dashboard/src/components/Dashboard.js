import React, { useEffect, useState } from 'react'
import { Grid, Typography, makeStyles, CircularProgress } from '@material-ui/core'
import { getCookie } from '../../utils/helpers'
import { BASE_URL, URL_DECODE_TOKEN } from '../../utils/urls'

const useStyles = makeStyles({
    title:{
        fontSize:'20px',
        textAlign:'center'
    },
    subtitle:{
        fontSize:'17px',
        textAlign:'center'
    }
})

const Dashboard = ({setSnackbar}) => {

    const classes = useStyles()

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if(getCookie('token')){
            getUserInfo(getCookie('token'))
        }
    },[])

    const getUserInfo = (token) => {
        setLoading(true)
        fetch(`${BASE_URL}${URL_DECODE_TOKEN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify({token})
        })
        .then( res => {
            if(res.status === 200) {
                res.json()
                .then( res => {
                    setUser({ name: res.name, surname: res.surname })
                    setLoading(false)
                })
                .catch( () => {
                    setSnackbar({open: true, message: 'An error occurred when trying to access your information.', severity: 'error'})
                    setLoading(false)
                })
            }else{
                setSnackbar({open: true, message: 'An error occurred when trying to access your information.', severity: 'error'})
                setLoading(false)
            }
        })
        .catch( () => {
            setSnackbar({open: true, message: 'An error occurred when trying to access your information.', severity: 'error'})
            setLoading(false)
        })
    }

    return (
        <Grid container justifyContent='center' alignItems='center' style={{marginTop:50}}>
            { loading ?
                <Grid item xs={12} container justify='center' style={{marginTop:50}}>
                    <CircularProgress />
                </Grid>
            : user && user.name && user.surname ?
                <>
                    <Grid item xs={12}>
                        <Typography className={classes.title}>Hello {user.name} {user.surname}!!!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.subtitle}>This is your dhashboard!</Typography>
                    </Grid>
                </>
            : null }
        </Grid>
    )
}

export default Dashboard