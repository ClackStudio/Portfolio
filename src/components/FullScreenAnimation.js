import React, { useEffect, useState } from 'react'
import logo from "../img/logo_2.svg"

const FullScreenAnimation = ({ data }) => {

    const [animated1 ,setAnimated1] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setAnimated1(true)
        }, 400)
    }, [animated1])




    return (
                <div className={"intro-logo-wrapper"}>
                    <div className={`intro-logo-wrapper ${animated1 ? 'transparent' : ''}`}>
                    <img src={logo} alt="clack studio" className="intro-logo"></img>
                    </div>
                </div>              
    )
}


export default FullScreenAnimation
