import React from 'react'

const CrossButton = ({ children, onClick, className, active }) => {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
      <div className={`crossed-line ${active ?? 'active'}`}></div>
    </button>
  )
}

export default CrossButton
