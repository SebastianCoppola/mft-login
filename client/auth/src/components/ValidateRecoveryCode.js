import React, { useEffect } from 'react'
//Mui:
import { Grid, Typography, Button, TextField, makeStyles } from '@material-ui/core'
//Utils:
import { BASE_URL, URL_VALIDATE_RECOVERY_CODE } from '../utils/urls'
import { useHistory } from 'react-router-dom'

const useStyle = makeStyles({
    form:{
        background:'#E4E6E3',
        borderRadius:'5px',
        boxShadow:' 0 4px 20px 0 rgba(37, 38, 94, 0.1)',
        maxWidth:500,
        padding:'30px 30px 50px 30px',
    }
})

const ValidateRecoveryCode = (props) => {
    
    const { setSnackbar, setLoading, request, setRequest } = props
    
    const classes = useStyle()
    const history = useHistory()
    
    useEffect(() => {
        if(!request.mail){
            history.push('/auth/')
        }
    }, [])

    const handleSubmit = () => {
        let callback = (bool) => {
            setLoading(false)
            setSnackbar({
                open: true, 
                message: bool ? 'Successful validation.' : 'Your code is not correct.', 
                severity: bool ? 'success': 'error'
            })
            if(bool){
                setTimeout(() => {
                    history.push('/auth/edit-password')
                },1000)
            }
        }
        setLoading(true)
        fetch(`${BASE_URL}${URL_VALIDATE_RECOVERY_CODE}`, {
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
                    RETRIEVE PASSWORD
                </Typography>
                <Typography style={{textAlign:'center', color:'#505050'}}>
                    An email has been sent with a code. Write it down to retrieve your password.
                </Typography>
            </Grid>
            <Grid item>
                <TextField 
                    fullWidth
                    label='Validation Code' 
                    variant='outlined'
                    value={request.validationCode}
                    onChange={e => setRequest({...request, validationCode: e.target.value})}
                />
            </Grid>
            <Grid item>
                <Button 
                    variant='contained' 
                    fullWidth 
                    disabled={!(request.validationCode)}
                    onClick={handleSubmit}
                >
                    <Typography style={{colo:'#505050', fontWeight:700}}>
                        SUBMIT
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}

export default ValidateRecoveryCode