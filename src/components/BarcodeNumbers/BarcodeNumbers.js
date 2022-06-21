import React, { useRef, useState } from 'react'
import { navigate } from 'gatsby'
import { useBackgroundStore } from './../../stores/BarCodeStore'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import useResizeObserver from '@react-hook/resize-observer'

export const ProjectTitle = ({ children, isShown }) => {
  return (
    <div className={`project-number-title ${isShown ? 'animate' : ''}`}>
      {children}
    </div>
  )
}

export const ProjectNumber = ({ project, index, isMobile }) => {
  const { currentHoveredBar, setCurrentHoveredBar } = useBackgroundStore()
  const [wasClicked, setClicked] = useState(false)
  const isHovered = index === currentHoveredBar
  const handlePointerEnter = () => {
    setCurrentHoveredBar(index)
  }
  const handlePointerLeave = () => {
    if (!isMobile) setCurrentHoveredBar(null)
  }
  const goToProject = () => {
    navigate(project.fields.slug)
    //setCanvasTransition(project.fields.slug)
  }

  React.useEffect(() => {
    setClicked(false)
  }, [currentHoveredBar])

  const handlePointerDown = () => {
    if (!isMobile || (isMobile && wasClicked)) {
      goToProject()
    } else {
      handlePointerEnter(index)
      setClicked(true)
    }
  }

  return (
    <div
      className="project-number-wrapper"
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className={`project-number ${isHovered && 'project-number-bar-hover'}`}
      >
        {index}
        {/* <div className='vertical-line'></div>
          <div className='horicontal-line'></div> */}
      </div>
      <ProjectTitle isShown={currentHoveredBar === index}>
        {project.frontmatter.client}
      </ProjectTitle>
    </div>
  )
}

const BarcodeNumbers = ({ projects, count, currentProjectId }) => {
  const breakpoints = useBreakpoint()
  const isMobile = breakpoints.sm
  const wrappersRef = useRef()
  const numbersRef = useRef()

  const centerStyleCalc = () => {
    // recalculating number positioning to center but left aligned when opening
    let newTransform = '50%'
    if (wrappersRef.current && numbersRef.current) {
      if (!isMobile) {
        const inner = numbersRef.current.getBoundingClientRect().width
        const outer = wrappersRef.current.getBoundingClientRect().width
        newTransform = outer / 2 - inner / 2 + `px`
      }
    }

    return {
    transform: !isMobile && `translateX(${newTransform})`,
    margin: isMobile ? 'auto' : 0,
  }}

  const [style, setStyle] = useState(centerStyleCalc())

  // Where the magic happens
  useResizeObserver(wrappersRef, (entry) => {
    setStyle(centerStyleCalc())
  })

 
  return (
    <div
      ref={wrappersRef}
      className="barcode-numbers-wrapper is-flex is-flex-direction-row is-justify-content-space-between"
    >
      {/* <div className="left">
      </div> */}
      <div
        ref={numbersRef}
        style={style}
        className="project-navigation-numbers is-flex is-flex-direction-row"
      >
        {projects.map(({ node }, index) => (
          <ProjectNumber
            project={node}
            index={index}
            key={`barNum_` + node.id}
            isMobile={isMobile}
          ></ProjectNumber>
        ))}
      </div>
      {/* <div className="right">
      {(currentHoveredBar !== null) && projects[currentHoveredBar].name }
      </div> */}
    </div>
  )
}

export default BarcodeNumbers
