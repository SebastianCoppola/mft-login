import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
//Hooks:
import usePasswordToggle from '../hooks/usePasswordToggle'
//Mui:
import { Grid, Typography, Button, TextField, makeStyles, InputAdornment } from '@material-ui/core'
//Utils:
import { validateEmail } from '../utils/helpers'
import { BASE_URL, URL_REGISTER } from '../utils/urls'

const useStyle = makeStyles({
    form:{
        background:'#E4E6E3',
        borderRadius:'5px',
        boxShadow:' 0 4px 20px 0 rgba(37, 38, 94, 0.1)',
        maxWidth:500,
        padding:'30px 30px 50px 30px',
    }
})

const Register = (props) => {
    
    const { setSnackbar, setLoading, request, setRequest } = props
    
    const classes = useStyle()
    const history = useHistory()
    
    const [PasswordInputType, ToggleIcon] = usePasswordToggle()

    const handleSubmit = () => {
        if(validateEmail(request.mail)){
            register()           
        }else{
            setSnackbar({
                open: true, 
                message: "Please submit a valid email address.", 
                severity: 'warning'
            })
        }
    }

    const register = () => {
        let callback = (bool) => {
            setSnackbar({
                open: true, 
                message: bool ? 'User created.' : 'There was a problem on creating your account.', 
                severity: bool ? 'success' : 'error'
            })
            setLoading(false)
            if(bool){
                setTimeout(()=>{
                    setRequest({mail:'', password:'', name:'', surname:''})
                    history.push('/auth/')
                },1000)
            }
        }
        setLoading(true)
        fetch(`${BASE_URL}${URL_REGISTER}`, {
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
    }

    const handleLogin = () => {
        setRequest({mail:'', password:'', name:'', surname:''})
        history.push('/auth/')
    }

    return (
        <Grid className={classes.form} container direction='column' spacing={3}>
            <Grid item>
                <Typography style={{textAlign:'center', fontWeight:700, color:'#505050'}}>
                    REGISTER
                </Typography>
                <Typography style={{textAlign:'center', color:'#505050'}}>
                    Complete your information to create an account. 
                </Typography>
                <Typography style={{textAlign:'center', color:'#505050'}}>
                    Have an account? &nbsp;
                    <Typography 
                        style={{textAlign:'center', color:'#4698FD', display:'inline', cursor:'pointer'}} 
                        onClick={handleLogin}
                    >
                    Login
                    </Typography>
                    . 
                </Typography>
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='Name' 
                    variant='outlined'
                    value={request.name}
                    onChange={e => setRequest({...request, name: e.target.value})}
                />
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='Surname' 
                    variant='outlined'
                    value={request.surname}
                    onChange={e => setRequest({...request, surname: e.target.value})}
                />
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='Email' 
                    variant='outlined'
                    value={request.mail}
                    onChange={e => setRequest({...request, mail: e.target.value})}
                />
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='New Password' 
                    variant='outlined'
                    value={request.password}
                    onChange={e => setRequest({...request, password: e.target.value})}
                    type={PasswordInputType}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position='end'>
                                {ToggleIcon}
                            </InputAdornment>
                        )
                    }}
                />
            </Grid>
            <Grid item>
                <Button 
                    variant='contained' 
                    fullWidth 
                    disabled={!(request.name && request.surname && request.mail && request.password)}
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

export default Register