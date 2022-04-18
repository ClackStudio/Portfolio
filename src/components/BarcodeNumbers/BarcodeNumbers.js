import React, {useRef, useReducer, useState} from 'react'
import { navigate } from 'gatsby';
import { useBackgroundStore } from "./../../stores/BarCodeStore";
import { useTransitionStore } from "./../../stores/TransitionStore"
import {projects} from '../../data.mock/projects.mock'


const ProjectTitle = ({children, isShown}) => {

  return (
    <div className={`project-number-title ${isShown ? "animate" : ""}`}> 
      {children}
    </div>
  )
}

const ProjectNumber = ({project , index}) => {
  const { setCanvasTransition } = useTransitionStore()
  const {currentHoveredBar, setCurrentHoveredBar} = useBackgroundStore()
  const isHovered = index === currentHoveredBar
  const handleMouseEnter = () => {
    setCurrentHoveredBar(index)
  }
  const handleMouseLeave = () => {
    setCurrentHoveredBar(null)
  }
  const goToProject = () => {
    console.log("GOTO", project)
    navigate(project.fields.slug)
    //setCanvasTransition(project.fields.slug)
  }

  return (
    <div className="project-number-wrapper" onClick={goToProject} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div  className={`project-number ${isHovered && 'project-number-bar-hover'}`} > 
      {index}
          {/* <div className='vertical-line'></div>
          <div className='horicontal-line'></div> */}
 
      </div>
<ProjectTitle isShown={currentHoveredBar === index}> 
          {project.frontmatter.title }
        </ProjectTitle>
    </div>
  )
}



const BarcodeNumbers = ({projects, count, currentProjectId}) => {
  const {currentHoveredBar} = useBackgroundStore()

return (
  <div className="barcode-numbers-wrapper is-flex is-flex-direction-row is-justify-content-space-between">
      <div className="left">
      </div>
      <div className='project-navigation-numbers is-flex is-flex-direction-row'>
          {projects.map(({node}, index) => (
              <ProjectNumber project={node} index={index} key={`barNum_` + node.id}>
              </ProjectNumber>
          ))}
      </div> 
      <div className="right">
      {(currentHoveredBar !== null) && projects[currentHoveredBar].name }
      </div>

  </div>
)
}

export default BarcodeNumbers;