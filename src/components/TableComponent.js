import React from 'react'
// import './all.sass'


const TableLayout = ({children}) => (
    <div className="meta-table" >
      {children}
    </div>
  )

const TableRowComponent = ({leftData, rightData, onMouseEnter, onMouseLeave, onClick, className}) => {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} className={`columns ${className}`}>

    <div className="column is-6 meta-title">
      {leftData}
    </div>
    <div className="column is-6 meta-data">
      {rightData}
    </div>
    <div className='table-cross-line'></div>
  </div>
  )
}

export { TableLayout, TableRowComponent} 


