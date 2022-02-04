import React, {useRef, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import './styles.sass'
import { Link, graphql, StaticQuery } from 'gatsby'
import testImage from '../../../static/img/clack-1.jpg'
import {useMove} from '@use-gesture/react'
import * as PIXI from 'pixi.js'
import {Stage, Container, Sprite, useTick, withFilters} from '@inlet/react-pixi'
import { AdjustmentFilter } from '@pixi/filter-adjustment';


const Filters = withFilters(Container, {
  blur: PIXI.filters.BlurFilter,
  adjust: AdjustmentFilter
});

const PixiImage = props => {


  const elRef = useRef(null)
  const app = useRef()
  const mousePosition = useRef({x: 1, y:1})
  const wrapper = useRef({width: 2, height:2})

  const mouseDown = useRef(false)

  // Resize function window
  const resize = (width, height) => {
    // Resize the renderer
    if (typeof app.current !== 'undefined') {
      app.current.renderer.resize(width, height);

    }
  }

  const observer = React.useRef(
    new ResizeObserver(entries => {
      // Only care about the first element, we expect one element ot be watched
      const { width, height } = entries[0].contentRect
      resize(width, height)
      console.log(wrapper.current.width)
      wrapper.current.width = width
      wrapper.current.height = height
    })
  )

  React.useEffect(() => {
    if (elRef.current) {
      observer.current.observe(elRef.current)
    }

    return () => {
      observer.current.unobserve()
    }
  }, [window, observer])




  return (
    <div  ref={elRef} className='pixi-image-wrapper'>
      {wrapper.current.width}
            <Stage
             width={window.width} 
             height={window.height} 
             options={{ backgroundAlpha: 0 }}
            //  renderOnComponentChange={false}
             onMount={(callback) => app.current = callback}
             >
            {/* <Filters scale={1} blur={{ blur: 10 }} adjust={{ gamma: mousePosition.current.x, brightness: 1 }}> */}

                {/* <Container x={0} y={0}> */}
                      <Filters scale={1} blur={{ blur: 10 }} adjust={{ gamma: 0.3, brightness: 1 }}>
                        <Sprite 
                         image={testImage}
                         x={0}
                         y={0}
                        //  width={wrapper.current.width}
                         height={wrapper.current.height}

                         />
                      </Filters>
                        {/* <Sprite
                            image={AngularLaser}
                            // visible={mouseDown.current}
                            // blendMode={mouseDown.current ? PIXI.BLEND_MODES.SUBTRACT : PIXI.BLEND_MODES.SRC_OUT}
                        /> */}
                                                {/* <Sprite
                            image={AngularLaser}
                            blendMode={PIXI.BLEND_MODES.HARD_LIGHT}
                        /> */}
                {/* </Container> */}
                {/* </Filters> */}

            </Stage>
    </div>
  )
}

PixiImage.propTypes = {

}

export default PixiImage

