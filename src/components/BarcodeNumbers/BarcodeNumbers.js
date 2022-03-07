import React, {useRef, useReducer, useState} from 'react'
import { navigate } from 'gatsby';
import { useBackgroundStore } from "./../../stores/BarCodeStore";
import { useTransitionStore } from "./../../stores/TransitionStore"
import {projects} from '../../data.mock/projects.mock'

import '../all.sass'

const ProjectNumber = ({project , index}) => {
  const { setCanvasTransition } = useTransitionStore()
  const {currentHoveredBar, setCurrentHoveredBar} = useBackgroundStore()
  const isHovered = index === currentHoveredBar
  const handleMouseEnter = () => {
    setCurrentHoveredBar(index)
    console.log(currentHoveredBar)
  }
  const handleMouseLeave = () => {
    setCurrentHoveredBar(null)
  }
  const goToProject = () => {
    setCanvasTransition(project.fields.slug)
  }

  return (
      <div onClick={goToProject} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`project-number ${isHovered && 'active'}`} > 
      {index}
          <div className='vertical-line'></div>
          <div className='horicontal-line'></div>
      </div>
  )
}


const BarcodeNumbers = ({projects, count, currentProjectId}) => {
  const {currentHoveredBar} = useBackgroundStore()

return (
  <div className="barcode-numbers-wrapper is-flex is-flex-direction-row is-justify-content-space-between">
      <div className="left">
      {(currentHoveredBar !== null) && projects[currentHoveredBar].node.frontmatter.title }
      </div>
      <div className='project-navigation-numbers is-flex is-flex-direction-row'>
          {projects.map(({node}, index) => (
              <ProjectNumber project={node} index={index} key={`barNum_` + node.id}></ProjectNumber>
          ))}
      </div> 
      <div className="right">
      {(currentHoveredBar !== null) && projects[currentHoveredBar].name }
      </div>

  </div>
)
}

export default BarcodeNumbers;