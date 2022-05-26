import React, { useRef, useState } from 'react'
import { navigate } from 'gatsby'
import { useBackgroundStore } from './../../stores/BarCodeStore'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import useResizeObserver from '@react-hook/resize-observer'

const ProjectTitle = ({ children, isShown }) => {
  return (
    <div className={`project-number-title ${isShown ? 'animate' : ''}`}>
      {children}
    </div>
  )
}

const ProjectNumber = ({ project, index }) => {
  const { currentHoveredBar, setCurrentHoveredBar } = useBackgroundStore()
  const isHovered = index === currentHoveredBar
  const handleMouseEnter = () => {
    setCurrentHoveredBar(index)
  }
  const handleMouseLeave = () => {
    setCurrentHoveredBar(null)
  }
  const goToProject = () => {
    navigate(project.fields.slug)
    //setCanvasTransition(project.fields.slug)
  }


  return (
    <div
      className="project-number-wrapper"
      onClick={goToProject}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
  const [transform, setTransform] = useState(false)
  const wrappersRef = useRef()
  const numbersRef = useRef()

  const centerStyleCalc = () => {
    // recalculating number positioning to center but left aligned when opening
    if (wrappersRef.current && numbersRef.current) {
      if (!transform && !isMobile) {
        const inner = numbersRef.current.getBoundingClientRect().width
        const outer = wrappersRef.current.getBoundingClientRect().width
        const newTransform = outer / 2 - inner / 2
        setTransform(newTransform)
      }
    }
    return {
    transform:
    !isMobile && `translateX(${transform ? transform + 'px' : '50%'})`,
  margin: isMobile ? 'auto' : 0,
  }}

  const [style, setStyle] = useState(centerStyleCalc())

  // React.useLayoutEffect(() => {
  //   setStyle
  // }, [wrappersRef])

  // Where the magic happens
  useResizeObserver(wrappersRef, (entry) => {
    setTransform(false)
    setStyle(centerStyleCalc())})

 


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
