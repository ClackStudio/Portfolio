import React, {useRef, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import './styles.sass'
import { Link, graphql, StaticQuery } from 'gatsby'
import testImage from '../../../static/img/clack-1.jpg'
import {useMove} from '@use-gesture/react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'


const FiberImage = props => {


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
      <Canvas>

      </Canvas>
    </div>
  )
}

FiberImage.propTypes = {

}

export default FiberImage

