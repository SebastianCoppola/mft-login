import React, {useRef, useEffect} from 'react'
import { mount } from 'auth/AuthApp'
import { useHistory } from 'react-router-dom' 

const AuthApp = ({onLogIn}) => {
    const ref = useRef(null)
    const history = useHistory()

    useEffect(()=>{
        const { onParentNavigate } = mount( ref.current, { 
            initialPath: history.location.pathname,
            onNavigate: ({ pathname: nextPathname }) => { 
                if(history.location.pathname !== nextPathname){
                    history.push(nextPathname)
                }
            },
            onLogIn,
        })
        history.listen(onParentNavigate)        
    },[])

    return <div ref={ref} />   
}

export default AuthApp