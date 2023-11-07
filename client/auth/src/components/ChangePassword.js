import React, { useState, useEffect } from 'react'
//Hooks:
import usePasswordToggle from '../hooks/usePasswordToggle'
//Mui:
import { Grid, Typography, Button, TextField, makeStyles, InputAdornment } from '@material-ui/core'
//Router:
import { useHistory } from 'react-router-dom'
//Utils:
import { BASE_URL, URL_EDIT_PASSWORD } from '../utils/urls'

const useStyle = makeStyles({
    form:{
        background:'#E4E6E3',
        borderRadius:'5px',
        boxShadow:' 0 4px 20px 0 rgba(37, 38, 94, 0.1)',
        maxWidth:500,
        padding:'30px 30px 50px 30px',
    }
})

const ChangePassword = (props) => {
    
    const { setSnackbar, setLoading, request, setRequest } = props
    
    const classes = useStyle()
    const history = useHistory()

    const [PasswordInputType1, ToggleIcon1] = usePasswordToggle()
    const [PasswordInputType2, ToggleIcon2] = usePasswordToggle()
    const [repeatedPassword, setRepeatedPassword] = useState('')
    
    useEffect(() => {
        if(!request.mail){
            history.push('/auth/')
        }
    }, [])
        
    console.log(request)

    const handleSubmit = () => {
        if(request.password === repeatedPassword){
            editPassword()
        }else{
            setSnackbar({
                open: true, 
                message: "Passwords doesn't match.", 
                severity: 'warning'
            })
        }
    }

    const editPassword = () => {
        let callback = (bool) => {
            setLoading(false)
            setSnackbar({
                open: true, 
                message: bool ? 'Your password has been changed successfuly.' : 'There was a problem. Please try again.', 
                severity: bool ? 'success' : 'error'
            })
            if(bool){
                setTimeout(()=>{
                    setRequest({mail: request.mail, password: '', name: '', surname: ''})
                    history.push('/auth/')
                },1000)
            }
        }
        setLoading(true)
        fetch(`${BASE_URL}${URL_EDIT_PASSWORD}`, {
            method: 'POST',
            headers: { "content-type" : "application/json"},
            body: JSON.stringify(request)
        })
        .then(res => {
            if(res.status === 200){
                callback(true)
            }else{
                callback(false)
            }
        })
        .catch(()=>{
            callback(false)
        })
    }

    return (
        <Grid className={classes.form} container direction='column' spacing={3}>
            <Grid item>
                <Typography style={{textAlign:'center', fontWeight:700, color:'#505050'}}>
                    CHANGE PASSWORD
                </Typography>
                <Typography style={{textAlign:'center', color:'#505050'}}>
                    Write down a new password for your account. 
                </Typography>
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='New Password' 
                    variant='outlined'
                    value={request.password}
                    onChange={e => setRequest({...request, password: e.target.value})}
                    type={PasswordInputType1}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position='end'>
                                {ToggleIcon1}
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='Repeat Password' 
                    variant='outlined' 
                    value={repeatedPassword}
                    onChange={e => setRepeatedPassword(e.target.value)}
                    type={PasswordInputType2}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position='end'>
                                {ToggleIcon2}
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item>
                <Button 
                    variant='contained' 
                    fullWidth 
                    disabled={!(request.password && repeatedPassword)}
                    onClick={handleSubmit}
                >
                    <Typography style={{colo:'#505050', fontWeight:700}}>
                        SAVE
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}

export default ChangePassword