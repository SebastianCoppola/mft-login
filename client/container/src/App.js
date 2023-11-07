import React, { lazy, Suspense, useState, useEffect } from 'react'
import { Route, Switch, Redirect, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { StylesProvider, createGenerateClassName, Grid} from '@material-ui/core'
import Progress from './components/Progress'
import { getCookie } from '../utils/helpers'

const AuthLazy = lazy( () => import('./components/AuthApp') )
const DashboardLazy = lazy( () => import('./components/DashboardApp') )

const generateClassName = createGenerateClassName({
    productionPrefix: 'co',
})

const history = createBrowserHistory()

const App = () => { 
    
    const [loading, setLoading] = useState(true)
    const [isLoged, setIsLoged] = useState(false)

    useEffect(()=>{
        setIsLoged( getCookie('token') ? true : false )
        setLoading(false)
    },[])
       
    useEffect(()=>{
        if(isLoged){
            history.push('/dashboard')
        }else{
            history.push('/auth')
        }
    },[isLoged])
   
    return (
        <Router history={history}>
            <StylesProvider generateClassName={generateClassName}>
                <Grid container>
                    { loading ?
                        <Progress />
                    :
                        <Grid item xs={12}>
                            <Suspense fallback={<Progress />}>
                                <Switch>
                                    <Route path='/dashboard'>
                                        <DashboardLazy onLogOut={()=>setIsLoged(false)} />
                                    </Route>
                                    <Route path='/auth'>
                                        <AuthLazy onLogIn={()=>setIsLoged(true)} />
                                    </Route>
                                    <Redirect to='/dashboard'/>
                                </Switch> 
                            </Suspense>
                        </Grid>
                    }
                </Grid>
            </StylesProvider>
        </Router>
    )
}

export default App