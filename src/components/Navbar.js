import React, { useState } from 'react'
import { Link } from 'gatsby'
import { useNavigationStore } from '../stores/NavigationStore'
import CrossLink from './CrossLink'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import CrossButton from './CrossButton'

const NavbarLogo = () => {
  return (
    <div className="navbar-item navbar-end has-text-centered">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item navbar-logo" title="Logo">
          clack studio
          <div className="crossed-line logo"></div>
        </Link>
      </div>
    </div>
  )
}

const DesktopNavMenu = ({ navItems, halfpage }) => (
  <div id="navMenu" className={`navbar-menu`} style={{ marginTop: '-4px' }}>
    {navItems
      .filter((item) => (halfpage ? item.shownInProjects : item.shownOnHome))
      .map((item, index) => (
        <div
          className="navbar-item navbar-start has-text-centered"
          key={`desktop-nav-item-${index}`}
        >
          <CrossLink slug={item.slug}> {item.name} </CrossLink>
        </div>
      ))}
    <NavbarLogo></NavbarLogo>
  </div>
)

const MobileNavMenu = ({ navItems }) => {
  const [menuOpen, setMenuState] = useState(false)

  const handleMenuClick = () => {
    setMenuState(!menuOpen)
  }

  return (
    <div
      id="navMenu"
      className={`navbar-menu mobile-navbar-menu`}
      style={{ marginTop: '-4px' }}
    >
      <div className="navbar-item navbar-start has-text-centered">
        <CrossButton onClick={handleMenuClick}> menu </CrossButton>
      </div>
      <div className={`fullscreen-menu ${menuOpen && 'open'}`}>
        {navItems
          .filter((item) => item.shownOnHome)
          .map((item, index) => (
            <div className="mobile-nav-item" key={`mobile-nav-item-${index}`}>
              <Link
                activeClassName={'active'}
                className="mobile-nav-link"
                to={item.slug}
              >
                {item.name}
              </Link>
            </div>
          ))}
      </div>

      <NavbarLogo></NavbarLogo>
    </div>
  )
}

const Navbar = ({ halfpage }) => {
  const { navItems } = useNavigationStore()
  const breakpoints = useBreakpoint()
  return (
    <nav
      className={`navbar is-transparent ${breakpoints.sm && 'mobile-nav'}`}
      role="navigation"
      aria-label="main-navigation"
    >
      {breakpoints.sm ? (
        <MobileNavMenu navItems={navItems} />
      ) : (
        <DesktopNavMenu navItems={navItems} halfpage={halfpage} />
      )}
    </nav>
  )
}

export default Navbar
export { NavbarLogo }
