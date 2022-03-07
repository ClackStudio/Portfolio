import React from 'react'
import './all.sass'

const SectionTemplate = ({children, className}) => (
  <section className={`section is-full-height is-flex is-flex-direction-column justify-content-center fill-container ${className}`}>
    <div className={`container is-max-desktop fill-container ${className}`}>
      {children}
    </div>
  </section>  
)

export default SectionTemplate


