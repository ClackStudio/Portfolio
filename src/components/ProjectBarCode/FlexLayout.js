/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { useThree, useLoader, MeshBasicMaterialProps, group } from '@react-three/fiber'
import { useBarCodeStore, useBackgroundStore } from "../../stores/BarCodeStore";
import { TransformControls, Sphere, CycleRaycast, BakeShadows, Bounds, useCursor, softShadows, shaderMaterial, Stats, useAspect, useHelper, BoxHelper } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated, config } from '@react-spring/three'
// import { projects } from '../../data.mock/projects.mock'
import { useTransitionStore, } from '../../stores/TransitionStore'
import Bar from './Bar'
import { navigate } from "gatsby-link";


// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== "undefined"


const FlexLayout = ({ projects, projectsIndex, isMobile }) => {

  const { viewport, size, camera } = useThree()

  const getCoordinateXLength = (pixelLength) => {
    const fraction = pixelLength / size.width
    const coordinateWidth = viewport.width * fraction
    return coordinateWidth
  }
  const getCoordinateYLength = (pixelLength) => {
    const fraction = pixelLength / size.height
    const coordinateHeight = viewport.height * fraction
    return coordinateHeight
  }


  const numberOfBars = projects.length
  const groupRef = useRef()
  const [vpWidth, vpHeight] = useAspect(size.width, size.height)
  useHelper(group, BoxHelper, 'royalblue')
  const { toSlug, animating, setAnimatingDone } = useTransitionStore()
  const [spring, rotationApi] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 5, friction: 0, clamp: true },

  }))



  const images = useLoader(THREE.TextureLoader, projects.map(project => {
    console.log('LOADING', project)
    if (project.node.frontmatter.featuredimage) return project.node.frontmatter.featuredimage.childImageSharp.gatsbyImageData.images.fallback.src

  }))



  let barWidth = 1
  let barHeight = 1
  let barWidthMobile = 1
  let barHeightMobile = 1
  let startingPoint = 0
  let sidePadding = 0
  let topStartingPoint = 0
  let bottomStartingPoint = 0

  const navbarHeight = projectsIndex ? 10 : 48
  const footerHeight = projectsIndex ? 10 : 100
  const pixelSide = 10

  if (isBrowser) {

    sidePadding = getCoordinateXLength(pixelSide)
    topStartingPoint = getCoordinateYLength(navbarHeight)
    bottomStartingPoint = getCoordinateYLength(footerHeight)

    // const [standardBarWidth, standardBarHeight] = useAspect('cover', size.width / numberOfBars, size.height - topPadding)
    // console.log(standardBarWidth)


    barWidth = (vpWidth - sidePadding * 2) / numberOfBars
    barHeight = vpHeight - (topStartingPoint + bottomStartingPoint)

    barWidthMobile = (vpWidth - sidePadding * 2)
    barHeightMobile = (vpHeight - (topStartingPoint + bottomStartingPoint) ) / numberOfBars

    startingPoint = vpWidth / 2 * -1
  }


  // console.log(group.current.geometry.computeBoundingBox())

  return (
    <>
      {isBrowser && !isMobile && (
        <group name="barcodes" ref={groupRef} position={[0, (topStartingPoint) / 2, 0]}>
          {projects.map((project, i) => {

            const isBeforeMiddle = i < (numberOfBars / 2)
            const isAfterMiddle = i >= (numberOfBars / 2)
            const isMiddle = ((i - (numberOfBars / 2)) === 1) && numberOfBars % 2 != 0

            const addOrigin = () => {
              if (isBeforeMiddle) {
                return 0
              } else if (isMiddle) {
                return barWidth / 2
              } else if (isAfterMiddle) {
                return barWidth
              }
            }

            return (
              // <mesh key={i}></mesh>
              <Bar
                key={i}
                index={i}
                name={'bar-' + (i + 1)}
                position={[startingPoint + i * (barWidth) + sidePadding + addOrigin(), 0, 0]}
                scale={[barWidth, barHeight, 1]}
                data={project}
                map={images[i]}
                width={barWidth}
                height={barHeight}
                numberOfBars={numberOfBars}
                isAfterMiddle={isAfterMiddle}
                isMiddle={isMiddle}
                isBeforeMiddle={isBeforeMiddle}
                projectsIndex={projectsIndex}
                isMobile={false}
              />
            )

          })}
        </group>
      )}

      {isBrowser && isMobile && (
        <group name="barcodes" ref={groupRef} position={[0, (topStartingPoint) / 2, 0]}>
          {projects.map((project, i) => {


 
            const yStartingPoint = vpHeight / 2 * -1
            const xStartingPoint = vpWidth / 2 * -1
            const isBeforeMiddle = i < (numberOfBars / 2)
            const isAfterMiddle = i >= (numberOfBars / 2)
            const isMiddle = ((i - (numberOfBars / 2)) === 1) && numberOfBars % 2 != 0
            barWidth = (vpWidth - sidePadding * 2)
            barHeight = (vpHeight - (topStartingPoint + bottomStartingPoint) ) / numberOfBars 


            const addOrigin = () => {
              if (isBeforeMiddle) {
                return 0
              } else if (isMiddle) {
                return barHeight / 2
              } else if (isAfterMiddle) {
                return barHeight
              }
            }
            const positionX = xStartingPoint +sidePadding
            const positionY = yStartingPoint + i * (barHeight) + sidePadding + addOrigin()
            console.log(positionX)

            return (
              // <mesh key={i}></mesh>
              <Bar
                key={i}
                index={i}
                name={'bar-' + (i + 1)}
                position={[positionX ,positionY, 0]}
                scale={[barWidth, barHeight, 1]}

                width={barWidth}
                height={barHeight}
                data={project}
                map={images[i]}
                numberOfBars={numberOfBars}
                isAfterMiddle={isAfterMiddle}
                isMiddle={isMiddle}
                isBeforeMiddle={isBeforeMiddle}
                projectsIndex={projectsIndex}
                isMobile
              />
            )

          })}
        </group>
      )}
    </>
  )
}

export default FlexLayout
