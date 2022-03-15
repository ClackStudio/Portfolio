import React, { useRef, forwardRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { useBarCodeStore, useBackgroundStore } from "../../stores/BarCodeStore";
import { useTransitionStore } from '../../stores/TransitionStore'
import { EffectComposer, GodRays, Bloom } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { useSpring, animated, config } from '@react-spring/three'
import { navigate } from 'gatsby';
import { useTexture } from '@react-three/drei'


const Sun = forwardRef(function Sun(props, forwardRef) {
  const [colorMap, alphaMap] = useTexture(['/img/laserTexture.png', '/img/laserAlpha.png'])

    // const { currentHoveredBar, setAnimatingDone, animating } = useBackgroundStore()
    const { toSlug, animating, setAnimatingDone } = useTransitionStore()


    // useEffect(()=> {
    //   if (toSlug !== null && animating) {
    //     console.log("toSlug", toSlug)
    //   rotationApi.start({rotation: [-2,0,0],      onRest: () => {
    //     console.log("SLZG", toSlug)
    //     navigate(toSlug)
    //     setAnimatingDone()
    //   }})
    //   }
    // }, [toSlug])


    useFrame(((_, delta) => {
        if(toSlug !== null && animating && forwardRef.current.position.y > -5) {
            forwardRef.current.position.y -= delta * 10
        } else if (forwardRef.current.position.y < -3) {
          forwardRef.current.position.y = 5
          navigate(toSlug)
          setAnimatingDone()

        } else {
          forwardRef.current.position.y = 5

        }
    }));
  
    return (
      <mesh ref={forwardRef} position={[0, 0, 3]}>
        <planeBufferGeometry args={[20,4]}></planeBufferGeometry>
        {/* <gradientShader attach="material" transparent opacity={0}></gradientShader> */}
        <meshBasicMaterial attach="material" side={THREE.DoubleSide} color="red" map={colorMap} alphaMap={alphaMap} transparent/>

      </mesh>
      // <mesh ref={forwardRef} position={[0, 0, 3]}>
      //   <planeGeometry args={[50, .004]} />
      //   <meshBasicMaterial color={"#FF0000"} />
      // </mesh>
    );
  });

const BarCodeBackground = props => {

    const { currentHoveredBar } = useBackgroundStore()

    const sunRef = useRef();

    return (
        <>
      <Sun ref={sunRef}/>
      {sunRef.current && (
        <EffectComposer multisampling={0}>
          {/* <GodRays
            sun={sunRef.current}
            blendFunction={BlendFunction.Screen}
            samples={60}
            density={0.99}
            decay={0.99}
            weight={1}
            exposure={.0001}
            clampMax={1}
            width={Resizer.AUTO_SIZE}
            height={Resizer.AUTO_SIZE}
            kernelSize={KernelSize.SMALL}
            blur={true}
          /> */}
          
          {/* <Bloom></Bloom> */}
        </EffectComposer>
      )}
    </>
        // <mesh>
        //     <planeBufferGeometry attach="geometry" args={[viewport.width, viewport.height]} />
        //     <meshBasicMaterial color={isHovering ? 'pink' : 'blue'}/>
        // </mesh>
    )
}

BarCodeBackground.propTypes = {

}

export default BarCodeBackground
