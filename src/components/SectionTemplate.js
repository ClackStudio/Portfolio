import React from 'react'
import './all.sass'

const SectionTemplate = ({children}) => (
  <section className="section is-full-height is-flex is-flex-direction-column justify-content-center fill-container">
    <div className="container is-max-desktop fill-container">
      {children}
    </div>
  </section>  
)

export default SectionTemplate


