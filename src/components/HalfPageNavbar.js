import React from 'react'
import { useNavigationStore } from '../stores/NavigationStore'
import CrossLink from './CrossLink'
import { NavbarLogo } from './Navbar'

const HalfPageNavbar = () => {
  const { navItems } = useNavigationStore()

  return (
    <nav
      className="half-page-navbar"
      role="navigation"
      aria-label="main-navigation"
    >
      <div
        id="navMenu"
        className="half-page-navbar-menu is-flex is-align-items-center is-flex-direction-row"
      >
        {navItems
          .filter((item) => item.shownInProjects === true)
          .map((item, index) => (
            <div
              className="navbar-item navbar-start has-text-centered"
              key={'nav-bar_' + index}
            >
              <CrossLink slug={item.slug}>{item.name}</CrossLink>
            </div>
          ))}
        <NavbarLogo />
      </div>
    </nav>
  )
}

export default HalfPageNavbar
