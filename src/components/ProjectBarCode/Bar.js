import React, {useState, useRef, Suspense, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
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






const WaveShaderMaterial = shaderMaterial(
  // Uniform
  { uColor: new THREE.Color(0.0, 0.0, 0.0),
    randomFactors: [1, 1, 1], 
    uTime: 1,
    noiseAmp: 0.01,
    noiseFreq: 0.5,
    uTexture: new THREE.Texture(),
    uAddNoise: 0,
  },
  // Vertex Shader
  glsl`
  precision mediump float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float noiseAmp;
  uniform float noiseFreq;

  varying float FuTime;


  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    void main() {
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
      FuTime = uTime;
      vec3 pos = position;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
  precision mediump float;
  uniform vec3 uColor;
  uniform float uAddNoise;

  varying float FuTime;
  uniform sampler2D uTexture;
  uniform vec3 random()Factors;

  varying vec2 vUv;


  float random()(vec2 st)
  {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec3 texture = texture2D(uTexture, vUv).rgb;
    // gl_FragColor = vec4(uColor,1.0);
    float strength = random()(vUv * random()Factors.xy * max(0.001, FuTime));
    // gl_FragColor = vec4(vec3(strength), 1.0);
    gl_FragColor = vec4(texture + (vec3(strength) * uAddNoise) , 1.0);
  }`,
);

extend({ WaveShaderMaterial })


const Bar = ({numberOfBars, data,width, index, height, position, scale, map,  ...props }) => {

  const ref = useRef()
  const geometry = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore()
  const { setCanvasTransition } = useTransitionStore()
  const slug = data.node.fields.slug
  const isLastOne = index === numberOfBars - 1

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

      // all nars open two the right but the last one opens to the left so it doe not overflow
      if (isLastOne) {
        geometry.current.translate( -0.5, 0, 0 )
      } else {
        geometry.current.translate( 0.5, 0, 0 )
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
    if (typeof ref.current !== 'undefined') {
      const isLastBarHovered = currentHoveredBar === numberOfBars - 1
      const halfOpenWidth = ((imageWidth - width))
      const lambda = 4;

      const barsBetweenHover = index - currentHoveredBar
      const scalePercentage = ((numberOfBars - barsBetweenHover + 1) / numberOfBars) 

      const barSizeToTheRight = width - (imageWidth / barsAfter)

      const expandBar = () => {
        ref.current.material.scale = ref.current.scale.x = damp(ref.current.scale.x, imageWidth, lambda, delta)
      }

      const moveBarToLeft = () => {
        ref.current.position.x = damp(ref.current.position.x, position[0] - (imageWidth - width), lambda, delta)
      }
      const moveBarToRightWithScale = () => {
        ref.current.material.scale = ref.current.scale.x = damp(ref.current.scale.x, width * scalePercentage, lambda, delta)
        if (!isLastOne) {
          ref.current.position.x = damp(ref.current.position.x, position[0] + ((halfOpenWidth * scalePercentage) ) , lambda, delta)

        } else {
          ref.current.position.x = damp(ref.current.position.x, position[0] + ((halfOpenWidth * scalePercentage) ) -width , lambda, delta)

        }
      }

      const moveBarToRight = () => {
        ref.current.position.x = damp(ref.current.position.x, position[0] + (imageWidth - width), lambda, delta)
      }

      const resetPosition = () => {
        ref.current.position.x = damp(ref.current.position.x, position[0], lambda, delta)

      }

      const resetScale = () => {
        ref.current.material.scale = ref.current.scale.x = damp(ref.current.scale.x, scale[0], lambda, delta)

      }

      if (currentHoveredBar === null) {
        resetScale()
        resetPosition()

      } else {
        if (index < currentHoveredBar) {
 
          // shrinkBar()
          if (isLastBarHovered) {
              moveBarToLeft()

          } else {
            resetScale()
            resetPosition()
          }
          // moveBarToLeft()
        } else if (index > currentHoveredBar) {
          // shrinkBar()
          moveBarToRightWithScale()
          // moveBarToRight()
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

        <patternShader attach="material" transparent {...barCodePatternProps} opacity={0}></patternShader>
      )}
      

    </animated.mesh>
  )
}

  export default Bar
