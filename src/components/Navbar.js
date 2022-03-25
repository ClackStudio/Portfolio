import React from "react";
import { Link } from "gatsby";
import { useNavigationStore } from "../stores/NavigationStore";
import CrossLink from "./CrossLink";

const NavbarLogo = () => {
  return (
    <div className="navbar-item navbar-end has-text-centered" >

  <div className="navbar-brand">
  <Link to="/" className="navbar-item navbar-logo" title="Logo">
    clack studio
    <div className='crossed-line'></div>
  </Link>
</div>
</div>
  )}

const Navbar = () => {
    const { navItems } = useNavigationStore()
    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
          <div
            id="navMenu"
            className={`navbar-menu`}
            style={{marginTop: "-4px"}}
          >
            {navItems.filter(item => item.shownOnHome).map( item => (
              <div className="navbar-item navbar-start has-text-centered" >
              <CrossLink  slug={item.slug}> {item.name} </CrossLink>
              </div>
            ))}
            <NavbarLogo></NavbarLogo>

          </div>
      </nav>
    );
  }

export default Navbar
export {NavbarLogo}