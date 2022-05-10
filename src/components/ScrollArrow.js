import React from 'react'
import ScrollArrowSvg from '../../static/img/ScrollArrow.svg'

const ScrollArrow = () => {
  return (
    <div className='scroll-arrow-wrapper'>
          <img alt="please scroll" src={ScrollArrowSvg} className="scroll-arrow"></img>
    </div>
  )
}


export default ScrollArrow