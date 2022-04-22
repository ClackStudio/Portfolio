import React from 'react'
import PropTypes from 'prop-types'
import ScrollArrowSvg from '../../static/img/ScrollArrow.svg'

const ScrollArrow = ({}) => {
  return (
    <div className='scroll-arrow-wrapper'>
          <img src={ScrollArrowSvg} className="scroll-arrow"></img>
    </div>
  )
}


export default ScrollArrow