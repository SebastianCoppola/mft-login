import React from 'react'
//Router:
import { useHistory } from 'react-router-dom'
//Hooks:
import usePasswordToggle from '../hooks/usePasswordToggle'
//Mui:
import { Grid, Typography, Button, TextField, makeStyles, InputAdornment } from '@material-ui/core'
//Utils:
import { validateEmail } from '../utils/helpers'
import { BASE_URL, URL_LOGIN, URL_SEND_LOGIN_CODE, URL_SEND_RECOVERY_CODE } from '../utils/urls'

const useStyle = makeStyles({
    form:{
        background:'#E4E6E3',
        borderRadius:'5px',
        boxShadow:' 0 4px 20px 0 rgba(37, 38, 94, 0.1)',
        maxWidth:500,
        padding:'30px 30px 50px 30px',
    }
})

const Login = (props) => {
    
    const { setSnackbar, setLoading, request, setRequest } = props
    
    const classes = useStyle()
    const history = useHistory()
    
    const [PasswordInputType, ToggleIcon] = usePasswordToggle()
    
    const handleSubmit = () => {
        if(validateEmail(request.mail)){
            login()
        }else{
            setSnackbar({
                open: true, 
                message: 'Please submit a valid email address.', 
                severity: 'warning'
            })
        }
    }

    const login = () => {
        setLoading(true)
        let errorCallback = (message) => {
            setSnackbar({ open: true,  message: message,  severity: 'error' })
            setLoading(false)
        }
        fetch(`${BASE_URL}${URL_LOGIN}`, {
            method: 'POST',
            headers: { "content-type" : "application/json"},
            body: JSON.stringify(request)
        })
        .then(res => {
            if(res.status === 200){
                setTimeout(()=>{ sendLoginCode() },1000)
            }else{
                res.json()
                .then(res=>{
                    errorCallback(res.message)
                })
            }
        })
        .catch(() => {
            errorCallback('Server Error. Please try again.')
        })
    }

    const sendLoginCode = () => {
        setRequest({mail: request.mail, password: '', name: '', surname: ''})
        fetch(`${BASE_URL}${URL_SEND_LOGIN_CODE}`, {
            method: 'POST',
            headers: { "content-type" : "application/json"},
            body: JSON.stringify(request)
        })
        .then(res => {
            if(res.status === 200){
                setTimeout(()=>{
                    setLoading(false)
                    history.push('/auth/validate-login-code')
                },1000)
            }else{
                setLoading(false)
                setSnackbar({
                    open: true, 
                    message: 'There has been a server error. Please try again later.', 
                    severity: 'error'
                })
            }
        })
    }

    const handleForgotenPasword = () => {
        if(!request.mail){
            setSnackbar({
                open: true, 
                message: 'You must complete your email to retrieve your password.', 
                severity: 'warning'
            })
        }else if(validateEmail(request.mail)){
            sendRecoveryCode()
        }else{
            setSnackbar({
                open: true, 
                message: 'Please submit a valid email address.', 
                severity: 'warning'
            })
        }
    }

    const sendRecoveryCode = () => {
        setLoading(true)
        setRequest({mail: request.mail, password: '', name: '', surname: ''})
        fetch(`${BASE_URL}${URL_SEND_RECOVERY_CODE}`, {
            method: 'POST',
            headers: { "content-type" : "application/json"},
            body: JSON.stringify(request)
        })
        .then(res => {
            if(res.status === 200){
                setTimeout(()=>{
                    setLoading(false)
                    history.push('/auth/validate-recovery-code')
                },1000)
            }else{
                setLoading(false)
                setSnackbar({
                    open: true, 
                    message: 'There has been a server error. Please try again later.', 
                    severity: 'error'
                })
            }
        })
    }

    const handleRegister = () => {
        setRequest({mail:'', password:'', name:'', surname:''})
        history.push('/auth/register')
    }

    return (
        <Grid className={classes.form} container direction='column' spacing={3}>
            <Grid item>
                <Typography style={{textAlign:'center', fontWeight:700, color:'#505050'}}>
                    LOG IN
                </Typography>
                <Typography style={{textAlign:'center', color:'#505050'}}>
                    Complete with your email and password to access. 
                </Typography>
                <Typography style={{textAlign:'center', color:'#505050'}}>
                    Haven't got an account? &nbsp;
                    <Typography 
                        style={{textAlign:'center', color:'#4698FD', display:'inline', cursor:'pointer'}} 
                        onClick={handleRegister}
                    >
                    Register
                    </Typography>
                    . 
                </Typography>
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='Email' 
                    type='email'
                    variant='outlined'
                    value={request.mail}
                    onChange={e => setRequest({...request, mail: e.target.value})}
                />
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    type={PasswordInputType}
                    label='Password' 
                    variant='outlined' 
                    value={request.password}
                    onChange={e => setRequest({...request, password: e.target.value})}
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
                    disabled={!(request.mail && request.password)}
                    onClick={handleSubmit}
                >
                    <Typography style={{colo:'#505050', fontWeight:700}}>
                        LOGIN
                    </Typography>
                </Button>
            </Grid>
            <Grid item>
                <Typography 
                    style={{textAlign:'center', color:'#4698FD', fontWeight:700, cursor:'pointer'}} 
                    onClick={handleForgotenPasword}
                >
                    Forgoten Password? 
                </Typography>
            </Grid>

        </Grid>
    )
}

export default Login