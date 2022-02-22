import React, { useRef, forwardRef} from 'react'
import './styles.sass'
import PropTypes from 'prop-types'
import { useFrame } from '@react-three/fiber'
import { useBarCodeStore, useBackgroundStore } from "../../stores/BarCodeStore";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";


const Sun = forwardRef(function Sun(props, forwardRef) {
    const { currentHoveredBar, setAnimatingDone, animating } = useBackgroundStore()


    useFrame(((_, delta) => {
        if(animating && currentHoveredBar && forwardRef.current.position.y > -5) {
            forwardRef.current.position.y -= delta * 25
        } else if (forwardRef.current.position.y < -5) {
          console.log("DONEEEE")
          setAnimatingDone()
          forwardRef.current.position.y = 5

        } else {
          forwardRef.current.position.y = 5

        }
    }));
  
    return (
      <mesh ref={forwardRef} position={[0, 0, 3]}>
        <planeGeometry args={[50, .01]} />
        <meshBasicMaterial color={"#FF0000"} />
      </mesh>
    );
  });

const BarCodeBackground = props => {

    const { currentHoveredBar } = useBackgroundStore()

    const sunRef = useRef();

    return (
        <>
      <Sun ref={sunRef} />
      {sunRef.current && (
        <EffectComposer multisampling={0}>
          <GodRays
            sun={sunRef.current}
            blendFunction={BlendFunction.Screen}
            samples={60}
            density={0.99}
            decay={0.97}
            weight={1}
            exposure={1}
            clampMax={1}
            width={Resizer.AUTO_SIZE}
            height={Resizer.AUTO_SIZE}
            kernelSize={KernelSize.SMALL}
            blur={true}
          />
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
