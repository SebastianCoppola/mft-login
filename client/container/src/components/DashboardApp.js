import React, {useRef, useEffect} from 'react'
import { mount } from 'dashboard/DashboardApp'

const DashboardApp = ({onLogOut}) => {
    
    const ref = useRef(null)

    useEffect(()=>{
        mount(ref.current, { onLogOut })
    },[])

    return <div ref={ref} />      
}

export default DashboardApp