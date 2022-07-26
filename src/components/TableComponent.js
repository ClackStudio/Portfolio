import React from 'react'
// import './all.sass'

const TableLayout = ({ children, className }) => (
  <div className={`meta-table ${className && className}`}>{children}</div>
)

const TableRowComponent = ({
  leftData,
  rightData,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  leftMaxWidth,
  noCrossLine
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`columns ${className}`}
    >
      <div className={`column is-6 meta-title`} style={{maxWidth: leftMaxWidth}}>{leftData}</div>
      <div className="column is-6 meta-data">{rightData}</div>
      {!noCrossLine && <div className="table-cross-line"></div>}
    </div>
  )
}

export { TableLayout, TableRowComponent }
