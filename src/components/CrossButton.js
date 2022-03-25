import React from 'react'

const CrossButton = ({children, onClick, className}) => {
  return (
    <button onClick={onClick} className={className}>
        {children}
        <div className='crossed-line'></div>
    </button>
  )
}

export default CrossButton