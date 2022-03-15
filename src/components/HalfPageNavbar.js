import React, { useState, useRef } from "react";
import { Link, navigate } from "gatsby";
import { useSpring, animated } from 'react-spring'
// import './navbar-styles.sass'

const HalfPageNavbar = () => {
  // const [state, setState] = useState({
  //   active: false,
  //   navBarActiveClass: "",
  // });

  const back = useRef()
  const containerRef = useRef()
  const logoRef = useRef()
  const initialSpring = { left: null ,right: 10 , width: 44}
  const [styles, api] = useSpring(() => (initialSpring))



  const moveLine = (item) => {
    const containerWidth = containerRef.current.getBoundingClientRect().width
    // const containerWidth = containerRef.current
    const x = item.current.getBoundingClientRect().x
    const itemWidth = item.current.getBoundingClientRect().width

    api.start({ right: containerWidth -  x - itemWidth, width: itemWidth})

  }
  const reset = () => {
    api.start(initialSpring)
  }
    
    const goBack = () => {
      console.log("goBAck")
      navigate(-1)
    }

    return (
      <nav
        className="half-page-navbar"
        role="navigation"
        aria-label="main-navigation"
        ref={containerRef}
      >
        <animated.div className="crossing-line" style={styles}></animated.div>
          <div
            id="navMenu"
            className="half-page-navbar-menu is-flex is-align-items-center is-flex-direction-row"
          >
            <div className="navbar-item navbar-start has-text-centered" onClick={goBack} >
              <a className="half-page-navbar-item"  ref={back} onMouseEnter={() => moveLine(back)} onMouseLeave={() => reset()}>
                back
              </a>
            </div>
            <div className="navbar-item navbar-end has-text-centered" >
            <Link to="/" className="half-page-navbar-item" title="Logo" ref={logoRef} onMouseEnter={() => moveLine(logoRef)} onMouseLeave={() => reset()}>
                clack studio
              </Link>
            </div>

          </div>
      </nav>
    );
  }

export default HalfPageNavbar;
