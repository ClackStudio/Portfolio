import React from 'react'

const CrossButton = ({children, onClick}) => {
  return (
    <button onClick={onClick}>
        {children}
        <div className='crossed-line'></div>
    </button>
  )
}

export default CrossButton