import React from 'react'
import { Link } from 'gatsby'

const CrossLink = ({ children, slug, className }) => {
  return (
    <Link to={slug} activeClassName="active" className={className}>
      {children}
      <div className="crossed-line"></div>
    </Link>
  )
}

export default CrossLink
