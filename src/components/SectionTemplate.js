import React from 'react'
// import './all.sass'

const SectionTemplate = ({children, className, innerClassName, placeOnTop}) => (
  <section className={`section is-full-height is-flex is-flex-direction-column justify-content-center fill-container ${className}`}>
    {placeOnTop}
    <div className={`container is-max-desktop fill-container ${innerClassName}`}>
      {children}
    </div>
  </section>  
)

export default SectionTemplate


