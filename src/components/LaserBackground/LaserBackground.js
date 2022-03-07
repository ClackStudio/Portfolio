import React, {useRef, useReducer, useState} from 'react'
import {useMove} from '@use-gesture/react'
import {Stage, Container, Sprite, useTick, withFilters} from '@inlet/react-pixi'
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import RadialLaser from '../../../static/img/radial.png'
import AngularLaser from '../../../static/img/angular.png'

import PropTypes from 'prop-types'


const LaserBackground = props => {

  const elRef = useRef(null)
  const app = useRef()

  // Resize function window
const resize = (width, height) => {
	// Resize the renderer
  console.log("RESIZE app‚", app.current)
  if (typeof app.current !== 'undefined') {
    app.current.renderer.resize(width, height);

  }
}

  const observer = React.useRef(
    new ResizeObserver(entries => {
      // Only care about the first element, we expect one element ot be watched
      const { width, height } = entries[0].contentRect
      resize(width, height)
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

    const mousePosition = useRef({x: 1, y:1})
    const mouseDown = useRef(false)


    useMove(({ xy: [x, y], down }) => {
        mousePosition.current = {x,y}
        mouseDown.current = down
    }, { target: window })


    const mapMousePosition = (event) => {
        // mousePosition.current.x = event.clientX
        // mousePosition.current.y = event.clientY

        
        // console.log(mousePosition.current.x)
    }

    const reducer = (_, { data }) => data
    const Bunny = () => {
      const [motion, update] = useReducer(reducer)
      const iter = useRef(0)
      useTick(delta => {
        const i = (iter.current += 0.01 * delta)
        update({
          type: 'update',
          data: {
            x: mousePosition.current.x,
            y: mousePosition.current.y,
            alpha: mouseDown.current ? 1 : 0,
            rotation: Math.sin(i) * Math.PI,
            // anchor: Math.sin(i / 2),
          },
        })
      })

      return (

        <Sprite
          image={RadialLaser}
          {...motion}
        />

      )
    }
    return (
        <div className='laser-background-wrapper' ref={elRef}>
            <Stage
             width={window.width} 
             height={window.height} 
             options={{ backgroundAlpha: 0 }}
            //  renderOnComponentChange={false}
             onMount={(callback) => app.current = callback}
             >
            {/* <Filters scale={1} blur={{ blur: 10 }} adjust={{ gamma: mousePosition.current.x, brightness: 1 }}> */}

                {/* <Container x={0} y={0}> */}
                        <Bunny />
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

LaserBackground.propTypes = {

}

export default LaserBackground

