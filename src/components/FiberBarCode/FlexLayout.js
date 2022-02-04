import React, {useState, useRef} from 'react'
import { useThree, useLoader, MeshBasicMaterialProps} from '@react-three/fiber'
import { useBarCodeStore, useBackgroundStore } from "./../../stores/BarCodeStore";
import { TransformControls, Sphere, CycleRaycast, BakeShadows, Bounds, useCursor, softShadows, shaderMaterial, Stats, useAspect, useHelper, BoxHelper } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../../data.mock/projects.mock'
import Bar from './Bar'


// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== "undefined"


const FlexLayout = () => {
    const { viewport, size } = useThree()
    const { numberOfBars } = useBarCodeStore();
    const group = useRef()
    const [vpWidth, vpHeight] = useAspect(size.width, size.height)
    useHelper(group, BoxHelper, 'royalblue')
    const images = useLoader(THREE.TextureLoader,projects.map(project => project.picture))


    let barWidth = 1
    let barHeight = 1
    let startingPoint = 0
    const padding = 0.25

    if (isBrowser) {



      // const [standardBarWidth, standardBarHeight] = useAspect('cover', size.width / numberOfBars, size.height - topPadding)
      // console.log(standardBarWidth)


      barWidth = (vpWidth - padding * 2) / numberOfBars
      barHeight = vpHeight - padding * 4
      startingPoint = vpWidth/2 * -1

      console.log("STARTINGPOINT ", startingPoint)

  }


      // console.log(group.current.geometry.computeBoundingBox())

    return (
        <>
        {isBrowser && (
          <>
          {Array.from({ length: numberOfBars }, (_, i) => {

            const barCodePatternProps = {
              number1: i === 0 ? 1 : Math.random() >0.5 ? 1 :0,
              number2: i === 0 ? 0 : Math.random() >0.5 ? 1 :0,
              number3: i === 0 ? 1 : Math.random() >0.5 ? 1 :0,
              number4: i === 0 ? 0 : Math.random() >0.5 ? 1 :0,
              number5: i === numberOfBars - 1 ? 0 : 1,
              number6: i === numberOfBars - 1 ? 1 : Math.random() >0.5 ? 1 :0,
              number7: i === numberOfBars - 1 ? 0 : Math.random() >0.5 ? 1 :0,
              number8: i === numberOfBars - 1 ? 1 : Math.random() >0.5 ? 1 :0,
            }
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
              map={images[i]}
              barCodePatternProps={barCodePatternProps}
              />
              )
  
                  
      
      })}        
      </>
    )}
    </>
    )
  }

  export default FlexLayout
