import React from 'react'
import ReactDOM from 'react-dom'
import { createMemoryHistory, createBrowserHistory } from 'history'
import App from './App'

//Mount function to start up the App:
const mount = (element, { onNavigate, defaultHistory, initialPath, onLogIn }) => {

    const history = defaultHistory || createMemoryHistory({
        initialEntries: [initialPath]
    })
    
    if(onNavigate){ 
        history.listen(onNavigate) 
    }
    
    ReactDOM.render(
        <App history={history} onLogIn={onLogIn} />,
        element
    )
    
    return {
        onParentNavigate({pathname: nextPathname}) {
            if(history.location.pathname !== nextPathname){
                history.push(nextPathname)
            }
        }
    }
}

//If we are in dev and isolation, call mount immediately:
if(process.env.NODE_ENV === 'development'){
    const devRoot = document.querySelector('#_auth-dev-root')
    const onLogIn = () => { console.log("Logging in...") }
    if (devRoot) { 
        mount(devRoot, { defaultHistory: createBrowserHistory(), onLogIn }) 
    }
}

//If we are running through Container, we should export mount function: 
export { mount }