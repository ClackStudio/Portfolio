import React, {useState, useRef, useEffect} from 'react'
import { useThree, useLoader, MeshBasicMaterialProps, group} from '@react-three/fiber'
import { useBarCodeStore, useBackgroundStore } from "../../stores/BarCodeStore";
import { TransformControls, Sphere, CycleRaycast, BakeShadows, Bounds, useCursor, softShadows, shaderMaterial, Stats, useAspect, useHelper, BoxHelper } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated, config } from '@react-spring/three'
// import { projects } from '../../data.mock/projects.mock'
import { useTransitionStore,  } from '../../stores/TransitionStore'
import Bar from './Bar'
import { navigate } from "gatsby-link";


// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== "undefined"


const FlexLayout = ({projects}) => {

    const { viewport, size } = useThree()
    const numberOfBars = projects.length
    const groupRef = useRef()
    const [vpWidth, vpHeight] = useAspect(size.width, size.height)
    useHelper(group, BoxHelper, 'royalblue')
    const { toSlug, animating, setAnimatingDone } = useTransitionStore()
    const [spring, rotationApi] = useSpring(() => ({ 
      rotation: [0,0,0], 
      config: {mass:1, tension:5, friction:0, clamp: true},

    }))



    useEffect(()=> {
      if (toSlug !== null && animating) {
        console.log("toSlug", toSlug)
      rotationApi.start({rotation: [-2,0,0],      onRest: () => {
        console.log("SLZG", toSlug)
        navigate(toSlug)
        setAnimatingDone()
      }})
      }
    }, [toSlug])


    const images = useLoader(THREE.TextureLoader,projects.map(project => {
      console.log('LOADING', project)
      if (project.node.frontmatter.featuredimage) return project.node.frontmatter.featuredimage.childImageSharp.gatsbyImageData.images.fallback.src
      
      }))



    let barWidth = 1
    let barHeight = 1
    let startingPoint = 0
    const padding = 0.25

    if (isBrowser) {



      // const [standardBarWidth, standardBarHeight] = useAspect('cover', size.width / numberOfBars, size.height - topPadding)
      // console.log(standardBarWidth)


      barWidth = (vpWidth - padding * 2) / numberOfBars
      barHeight = vpHeight
      startingPoint = vpWidth/2 * -1
  }


      // console.log(group.current.geometry.computeBoundingBox())

    return (
        <>
        {isBrowser && (
          <animated.group name="barcodes" rotation={spring.rotation} ref={groupRef}>
          {projects.map((project, i) => {
            

            return (
              // <mesh key={i}></mesh>
              <Bar
              key={i}
              index={i}
              name={'bar-' + (i + 1)}
              position={[startingPoint + i * (barWidth) + padding + ((i === numberOfBars -1) ? barWidth : 0), 0, 0]}
              scale={[barWidth, barHeight, 1]}
              width={barWidth}
              height={barHeight}
              data={project}
              map={images[i]}
              numberOfBars={numberOfBars}
              />
              )    
      
      })}        
      </animated.group>
    )}
    </>
    )
  }

  export default FlexLayout
