/* eslint-disable */
import React, {useState, useRef, Suspense, useEffect, useMemo} from 'react'
import PropTypes, { number } from 'prop-types'
import { Canvas, useFrame, useThree, mesh, boxGeometry, meshBasicMaterial, extend, useLoader } from '@react-three/fiber'
import { CycleRaycast, useCursor, shaderMaterial, useBVH } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'
import { useBackgroundStore } from "../../stores/BarCodeStore";
import { useTransitionStore } from '../../stores/TransitionStore'
import PatternShader from './PatternShader'
import { navigate } from "gatsby"
import { useMemoOne } from 'use-memo-one';


const Bar = ({isMobile, projectsIndex, numberOfBars, data,width, index, height, position, scale, map, isBeforeMiddle, isMiddle, isAfterMiddle, ...props }) => {

  const ref = useRef()
  const geometry = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore()
  const { setCanvasTransition } = useTransitionStore()
  const slug = data.node.fields.slug
  const isFirst = index === 0
  const isLast = index === numberOfBars - 1

  const barCodePatternProps = useMemoOne(() => {
    const isFirst = index === 0
    const isLast = index === numberOfBars
    const random = () => Math.random() >0.5 ? 1 :0
    return{
    number1: isFirst ? 1 : random(),
    number2: isFirst ? 0 : random(),
    number3: isFirst ? 1 : random(),
    number4: isFirst ? 0 : random(),
    number5: random(),
    number6: random(),
    number7: random(),
    number8: random(),
    number10: random(),
    number10: random(),
    number12: random(),
    number13: isLast ? 0 : 1,
    number14: isLast ? 1 : random(),
    number15: isLast ? 0 : random(),
    number16: isLast ? 1 : random(),
  }}, [index, numberOfBars])

  // the following controls to which side the bars open by translating the origin
  useEffect(()=> {
    if (typeof geometry.current !== 'undefined') {
      if(isMobile) {
      // all nars open two the right but the last one opens to the left so it doe not overflow
      if (isBeforeMiddle) {
        geometry.current.translate( 0.5, 0.5, 0 )
      } else if (isMiddle) {
        geometry.current.translate( 0.5, 0, 0 )
      } else if (isAfterMiddle) {
        geometry.current.translate( 0.5, -0.5, 0 )
      }
      } else {
      // all nars open two the right but the last one opens to the left so it doe not overflow
      if (isBeforeMiddle) {
        geometry.current.translate( 0.5, 0, 0 )
      } else if (isMiddle) {
        geometry.current.translate( 0, 0, 0 )
      } else if (isAfterMiddle) {
        geometry.current.translate( -0.5, 0, 0 )
      }
      }

    }
  }, [index])
  
  const howManyBarsAfter = (numberOfBars, index) => [...Array(numberOfBars).keys()].filter(number => number >= index).length
  const howManyBarsBefore = (numberOfBars, index) => [...Array(numberOfBars).keys()].filter(number => number <= index).length

  const barsBefore = howManyBarsBefore(numberOfBars, index)
  const barsAfter = howManyBarsAfter(numberOfBars, index)


  //const [imageWidth, imageHeight] = useAspect(map.image.width, map.image.height, 1)
  const aspectRatio = map.image.width / map.image.height
  const imageWidth = aspectRatio * height

  const damp = THREE.MathUtils.damp
  useFrame((state, delta) => {
    if (typeof ref.current !== 'undefined' && !isMobile) {
      // TODO: normalisedImageWidth is bugged its not working well on wide screens as it becomes a tiny number
      const extraWidth = imageWidth > width ? imageWidth - width : 0
      const hoveredBarOpenedToTheRight = currentHoveredBar < (numberOfBars / 2)
      // lambda defines the animation-tension of the spring
      const lambda = projectsIndex ? 8: 4;

      const barsBetweenHover = Math.abs(index - currentHoveredBar)
        
      const scalePercentage = ((numberOfBars - barsBetweenHover + 1) / numberOfBars) 

      const debug = () => {
        console.log("hoveredBarOpenedToTheRight", hoveredBarOpenedToTheRight)
        console.log("width", width)
        console.log("extraWidth", extraWidth)
        console.log("scalePercentage", scalePercentage)
        console.log("barsBetweenHover", barsBetweenHover)
        console.log("currentHoveredBar", currentHoveredBar)

        console.log("((extraWidth * scalePercentage) ) ", ((extraWidth * scalePercentage) ))
      }

      const expandBar = () => {
        ref.current.material.scale = ref.current.scale.x = damp(ref.current.scale.x, imageWidth, lambda, delta)
        ref.current.position.z = 0.001
        // ref.current.position.z = damp(ref.current.position.z,position.z + 0.001, lambda, delta)
      }

      const resetPosition = () => {
        ref.current.position.x = damp(ref.current.position.x, position[0], lambda, delta)

      }

      const resetScale = () => {
        ref.current.material.scale = ref.current.scale.x = damp(ref.current.scale.x, scale[0], lambda, delta)
        // ref.current.position.z = position.z
      }

      const scaleDown = () => {
        ref.current.material.scale = ref.current.scale.x = damp(ref.current.scale.x, extraWidth * scalePercentage, lambda, delta)
        ref.current.position.z = 0.00

      }

      const moveBarWithScale = (direction) => {
        if(index === 1) debug()
        if (isBeforeMiddle) {
          if (!hoveredBarOpenedToTheRight || index > currentHoveredBar) {
            scaleDown()
            ref.current.position.x = damp(ref.current.position.x, position[0] + (((isFirst ? 0 : width) * scalePercentage) * direction ) , lambda, delta)
          }else {
            resetPosition()
            resetScale()
          }
        } else if (isMiddle) {
        // Middle should not be used :D
          ref.current.position.x = damp(ref.current.position.x, position[0] + ((extraWidth * scalePercentage) * direction ) , lambda, delta)
        }
         else if (isAfterMiddle) {
          if (hoveredBarOpenedToTheRight  || index < currentHoveredBar) {
            scaleDown()
                     // the middel shoul always stay in the same position stay in the same position (there is not always a middle though)
            ref.current.position.x = damp(ref.current.position.x, position[0] + ((((isLast ? 0 : extraWidth) * scalePercentage) ) * direction)  , lambda, delta)
          } else {
            resetPosition()
            resetScale()
          }
        }
      }

      if (currentHoveredBar === null) {
        resetScale()
        resetPosition()

      } else {
        if (index < currentHoveredBar) {
          moveBarWithScale(-1)
        } else if (index > currentHoveredBar) {
          moveBarWithScale(+1)
        }else if (index === currentHoveredBar) {
          // if current one is hovered scale it to the image width and bring it to original position
          expandBar()
          resetPosition()
        }
      }

    }

  })


  const hoverHandler = (key) => {
    setHovered(true)
    setCurrentHoveredBar(key)
  }

  const transitionToSlug = (slug) => {
    // navigate(slug)
    setCanvasTransition(slug)
  }

    // better raycaster
  useBVH(ref)
  // mousepointer
  // useCursor(currentHoveredBar !== index)
  return (

    <animated.mesh
      ref={ref}
      scale={scale}
      position={position}
      onClick={(e) => (e.stopPropagation(), transitionToSlug(slug))}
      onPointerOver={(e) => (e.stopPropagation(), hoverHandler(index))}
      onPointerOut={(e) => hoverHandler(null)}>
      <planeBufferGeometry       ref={geometry}
/>

      {currentHoveredBar === index ? (
      <meshBasicMaterial attach="material" toneMapped={false} color={clicked ? 'lightblue' : currentHoveredBar === index ? 'white' : 'black'} opacity={currentHoveredBar === index ? 1 : 0} map={map}/>

      ): (
        // <meshBasicMaterial attach="material" opacity={0.6} color="red"/>
        <patternShader attach="material" transparent isMobile={isMobile} {...barCodePatternProps} opacity={0} ></patternShader>
      )}
      

    </animated.mesh>
  )
}

  export default Bar
