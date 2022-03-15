import React, { Suspense, useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { AdaptiveEvents, useAspect, Html, Plane, Sphere } from '@react-three/drei'
import BarCodeBackground from './ProjectBarCode/BarCodeBackground'
// import PreviewCompatibleImage from './PreviewCompatibleImage'
import { GRAY } from '../helpers/Colors'
import logo from "../../static/img/logo_2.svg"
import GradientShader from './ProjectBarCode/shaders/GradientShader'
import { EffectComposer, GodRays, Bloom, Noise } from "@react-three/postprocessing";
import { useControls, button } from 'leva'
import { useTransitionStore } from '../stores/TransitionStore'
import { useSpring, animated, useSpringRef } from '@react-spring/three'
import { delay } from 'lodash'


const AnimatedHtml = animated(Html)
 
const FullScreenAnimation = ({ data }) => {


    const { setIntroAnimationDone } = useTransitionStore()

    const [animated1 ,setAnimated1] = useState(false)

    const startValues = {
        position: [0, 7, 1],
        args: [20, 1], 
    }

    const endValues = {
        position: [0, -7, 1],
        args: [20, 6], 
    }

    const [spring, springApi] = useSpring(() => ({ 
        from: {...startValues},
        to: {...endValues},
        onRest: () => setIntroAnimationDone(),
        config: {mass:1, tension:2, friction:0, clamp: true},
        delay: 800,
      }))

      springApi.start()

    const sceneRef = useRef()
    const sunRef = useRef()
    // const { y, z, height, noise } = useControls({
    //     start: button((get) => springApi.start(endValues)),
    //     reset: button((get) => springApi.start(startValues)),
    //     // reset: button((get) => alert(`Number value is ${get('number').toFixed(2)}`)),

    //      y: {
    //         value: 4,
    //         min: -7,
    //         max: 7,
    //         step: 0.03,
    //       },
    //       noise: {
    //         value: 0,
    //         min: 0,
    //         max: 1,
    //         step: 0.01,
    //       },
    //      z: 1, height: 6 })


    useEffect(() => {
        setTimeout(() => {
            setAnimated1(true)
        }, 1)
    }, [animated1])




    return (
        <Suspense fallback={null}>
            <Canvas resize={{ debounce: 0, scroll: false }} ref={sceneRef}>

                <color attach="background" args={[GRAY]} />
                                    {/* <directionalLight color={"white"} intensity={0.2} lookAt={[0,0,0]} position={[0,0,5]}></directionalLight> */}

                {/* <Plane args={[20,20]} position={[0,0,-5]}>
                <meshBasicMaterial color={"white"}></meshBasicMaterial>
                </Plane> */}
                <animated.mesh {...spring} ref={sunRef}>
                    <planeBufferGeometry args={[20,6]}></planeBufferGeometry>
                    <gradientShader attach="material"></gradientShader>
                </animated.mesh>
                <AnimatedHtml
                    occlude
                    as='div' // Wrapping element (default: 'div')
                    wrapperClass="intro-logo-wrapper" // The className of the wrapping element (default: undefined)
                    fullscreen // Aligns to the upper-left corner, fills the screen (default:false) [ignored in transform mode]
                    // zIndexRange={[100, 0]} // Z-order range (default=[16777271, 0])
                    // sprite // Renders as sprite, but only in transform mode (default=false)
                    //   calculatePosition={(el: Object3D, camera: Camera, size: { width: number; height: number }) => number[]} // Override default positioning function. (default=undefined) [ignored in transform mode]
                >
                    <div className={`intro-logo-wrapper ${!animated1 ? 'transparent' : ''}`}>
                    <img src={logo} className="intro-logo"></img>
                    </div>
                </AnimatedHtml>
                <AdaptiveEvents />
                <EffectComposer>
                    <Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={300}></Bloom>
                    {/* <Noise opacity={noise}></Noise> */}
                    {/* <GodRays
                        sun={sunRef.current}
                    /> */}

                </EffectComposer>
                
                {/* <BarCodeBackground isIntro></BarCodeBackground> */}
            </Canvas>

        </Suspense>
    )
}


export default FullScreenAnimation
