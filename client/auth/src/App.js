import React, { useState } from 'react'
//Router:
import { Switch, Route, Router, Redirect } from 'react-router-dom'
//Mui:
import { StylesProvider, createGenerateClassName, Grid } from '@material-ui/core'
//Components:
import Login from './components/Login'
import Register from './components/Register'
import ChangePassword from './components/ChangePassword'
import ValidateLoginCode from './components/ValidateLoginCode'
import ValidateRecoveryCode from './components/ValidateRecoveryCode'
//Common: 
import SnackBar from './components/common/SnackBar'
import Loader from './components/common/Loader'

const generateClassName = createGenerateClassName({ productionPrefix: 'au' })

const App = ({history, onLogIn}) => {
    
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: ''})
    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState({mail: '', password: '', name: '', surname: ''})  

    console.log("Hello World from Auth App.js")

    return (
        <StylesProvider generateClassName={generateClassName}>
            <Grid container justifyContent='center' alignItems='center' style={{marginTop:'100px'}}>
                <Router history={history}>
                    <Switch>
                        <Route path='/auth' exact>
                            <Login 
                                setSnackbar={setSnackbar} 
                                setLoading={setLoading} 
                                request={request}
                                setRequest={setRequest}
                            />
                        </Route>
                        <Route path='/auth/validate-login-code'>
                            <ValidateLoginCode 
                                setSnackbar={setSnackbar} 
                                setLoading={setLoading}
                                request={request}
                                setRequest={setRequest}
                                onLogIn={onLogIn}
                            />
                        </Route>
                        <Route path='/auth/register' exact>
                            <Register 
                                setSnackbar={setSnackbar} 
                                setLoading={setLoading} 
                                request={request}
                                setRequest={setRequest}
                            />
                        </Route>
                        <Route path='/auth/validate-recovery-code'>
                            <ValidateRecoveryCode 
                                setSnackbar={setSnackbar} 
                                setLoading={setLoading}  
                                request={request}
                                setRequest={setRequest}
                            />
                        </Route>
                        <Route path='/auth/edit-password'>
                            <ChangePassword 
                                setSnackbar={setSnackbar} 
                                setLoading={setLoading} 
                                request={request}
                                setRequest={setRequest}
                            />
                        </Route>
                        { onLogIn === undefined && <Redirect to='/auth'/> }
                    </Switch>
                </Router>
                <SnackBar 
                    open={snackbar.open}
                    onClose={()=>setSnackbar({open:false})}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
                <Loader loading={loading} />
            </Grid>
        </StylesProvider>
    )
}

export default App