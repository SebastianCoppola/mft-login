import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

//Mount function to start up the App:
const mount = (element, { onLogOut }) => {
    ReactDOM.render(
        <App onLogOut={onLogOut} />,
        element
    )
}

//If we are in dev and isolation, call mount immediately:
if(process.env.NODE_ENV === 'development'){
    const devRoot = document.querySelector('#_dashboard-dev-root')
    let onLogOut = () => { console.log("Logging out...") }
    if (devRoot) { 
        mount(devRoot, { onLogOut }) 
    }
}

//If we are running through Container, we should export mount function: 
export { mount }