import React, { useState } from 'react'
import { Visibility as VisibilityOn, VisibilityOff } from '@material-ui/icons'

const usePasswordToggle = () => {
    const [visible, setVisible]= useState(false)
    
    const Icon = (
        <>
            {visible ?
                <VisibilityOn onClick= {()=>setVisible(visibility => !visibility)} style={{cursor:'pointer'}}/>
            :
                <VisibilityOff onClick= {()=>setVisible(visibility => !visibility)} style={{cursor:'pointer'}}/>
            }
        </>        
    )
    
    const PasswordInputType = visible ? 'text' : 'password'
    
    return [PasswordInputType, Icon]
}

export default usePasswordToggle