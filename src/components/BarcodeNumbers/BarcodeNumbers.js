import React, { useRef, useState } from 'react'
import { navigate } from 'gatsby'
import { useBackgroundStore } from './../../stores/BarCodeStore'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import useResizeObserver from '@react-hook/resize-observer'
import { useDrag } from '@use-gesture/react'

export const ProjectTitle = ({ children, isShown }) => {
  return (
    <div className={`project-number-title ${isShown ? 'animate' : ''}`}>
      {children}
    </div>
  )
}

export const ProjectNumber = ({ project, index, isMobile }) => {
  const { currentHoveredBar, setCurrentHoveredBar, setCurrentClickedNumber, currentClickedNumber} = useBackgroundStore()
  const [wasClicked, setClicked] = useState(false)
  const isHovered = index === currentHoveredBar
  const handlePointerEnter = () => {
    setCurrentHoveredBar(index)
  }
  const handlePointerLeave = () => {
    if (!isMobile) setCurrentHoveredBar(null)
  }
  const goToProject = () => {
    setCurrentClickedNumber(null)
    navigate(project.fields.slug)
  }

  React.useEffect(() => {
    setClicked(false)
  }, [currentHoveredBar])

  const handlePointerDown = () => {
    if (!isMobile || (isMobile && (wasClicked || currentClickedNumber === index))) {
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
  const { currentHoveredBar, setCurrentHoveredBar, setCurrentClickedNumber} = useBackgroundStore()
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
  const saved = useRef(0)

  const bind = useDrag(
    ({ initial, down, last, elapsedTime, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
      if (isMobile) {
        const isFirst = currentHoveredBar === 0
        const isLast = currentHoveredBar === projects.length - 1

        const directionalAdd = () => {
          if (dx > 0) {
            if (!isLast) {
              return 1
            }
          } else {
            if (!isFirst) {
              return -1
            }
          }
          return 0
        }
        const velocityCalc = (velocity) => {
          saved.current = saved.current + velocity
          if (saved.current > 0.1 && elapsedTime > 300) {
            setCurrentHoveredBar(currentHoveredBar + directionalAdd())
            // setCurrentClickedNumber(currentHoveredBar + directionalAdd())
            saved.current = 0
          }
          if (last) {
            setCurrentClickedNumber(currentHoveredBar)
          }
        }
        // const movementThreshold = 40
        // const velocityThreshold = 0

        velocityCalc(vy)
        // if (my > movementThreshold && vy > velocityThreshold) {

        //   setCurrentHoveredBar(currentHoveredBar + directionalAdd())
        // }
        // console.log("VELOCITY", vy)
      }
    }
  )
 
  return (
    <div
      ref={wrappersRef}
      className="barcode-numbers-wrapper is-flex is-flex-direction-row is-justify-content-space-between"
    >
      <div
        {...bind()}
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
    </div>
  )
}

export default BarcodeNumbers
