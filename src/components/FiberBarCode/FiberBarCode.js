import React, {Suspense} from 'react'
import './styles.sass'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { Stats, AdaptiveEvents } from '@react-three/drei'
import BarCodeBackground from './BarCodeBackground'
import FlexLayout from './FlexLayout'
import BarcodeNumbers from '../BarcodeNumbers/BarcodeNumbers'
import {GRAY} from '../../helpers/Colors'


const FiberBarCode = props => {
    return (
        <div className="canvas-wrapper">
            <Canvas dpr={[1, 1.5]} resize={{ debounce: 0, scroll: false }}>
            <color attach="background" args={[GRAY]} />

            <Stats showPanel={0} className="stats"/>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                  {/* Main */}
                  <directionalLight
                      position={[1, 10, -2]}
                      intensity={1}
                  />
                <FlexLayout></FlexLayout>

                  <AdaptiveEvents />

                <BarCodeBackground></BarCodeBackground>
              </Suspense>
            </Canvas>
          <BarcodeNumbers></BarcodeNumbers>
        </div>
        )
}







FiberBarCode.propTypes = {

}

export default FiberBarCode
