import React, { useState, useRef } from "react";
import { Link } from "gatsby";
import { useSpring, animated } from 'react-spring'
import github from "../img/github-icon.svg";
import logo from "../img/logo.svg";
// import './navbar-styles.sass'

const Navbar = () => {
  // const [state, setState] = useState({
  //   active: false,
  //   navBarActiveClass: "",
  // });
  const [underlinedItem, setUnderlinedItem] = useState(null)

  const item1 = useRef()
  const item2 = useRef()
  const item3 = useRef()
  const item4 = useRef()
  const containerRef = useRef()
  const logoRef = useRef()
  const initialSpring = { left: null ,right: 10 , width: 44}

  const [styles, api] = useSpring(() => (initialSpring))



  // const toggleHamburger = () => {
  //   // toggle the active boolean in the state

  //   setState({
  //     active: !state.active
  //   }, [() => {
  //     // set the class in state for the navbar accordingly
  //     this.state.active
  //       ? setState({
  //         ...state,
  //         navBarActiveClass: "is-active",
  //       })
  //       : setState({
  //         ...state,
  //         navBarActiveClass: "",
  //       });
  //   }])

  // }


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

    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container" ref={containerRef}>
        <animated.div className="crossing-line" style={styles}></animated.div>
          <div
            id="navMenu"
            className={`navbar-menu`}
          >
            <div className="navbar-start has-text-centered">
              <Link className="navbar-item" to="/about" ref={item1} onMouseEnter={() => moveLine(item1)} onMouseLeave={() => reset()}>
                about us
              </Link>
              <Link className="navbar-item" ref={item2} onMouseEnter={() => moveLine(item2)} onMouseLeave={() => reset()} to="/projects">
                projects
              </Link>
              <Link className="navbar-item" ref={item3} onMouseEnter={() => moveLine(item3)} onMouseLeave={() => reset()} to="/contact">
                contact
              </Link>
              <Link className="navbar-item" ref={item4} onMouseEnter={() => moveLine(item4)} onMouseLeave={() => reset()} to="/imprint">
                imprint
              </Link>
            </div>
            <div className="navbar-end has-text-centered">

            </div>
            <div className="navbar-brand">
              <Link to="/" className="navbar-item" title="Logo" ref={logoRef} onMouseEnter={() => moveLine(logoRef)} onMouseLeave={() => reset()}>
                clack studio
                {/* <img src={logo} alt="Kaldi" style={{ width: "88px" }} /> */}
              </Link>
              {/* Hamburger menu */}
              {/* <div
                className={`navbar-burger burger ${state.navBarActiveClass}`}
                data-target="navMenu"
                role="menuitem"
                tabIndex={0}
                onKeyPress={() => toggleHamburger()}
                onClick={() => toggleHamburger()}
              >
              </div> */}
            </div>
          </div>
        </div>
      </nav>
    );
  }

export default Navbar;
