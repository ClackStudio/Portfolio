import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { useNavigationStore } from "../stores/NavigationStore";
import CrossLink from "./CrossLink";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import CrossButton from "./CrossButton";
import { globalHistory } from "@reach/router";
import { useBackgroundStore } from "../stores/BarCodeStore";
import logo from "../img/clack-studio_logo_Nav.svg";
import boldLogo from "../img/Website_SVG.svg";

const NavbarLogo = () => {
  return (
    <div className="navbar-item navbar-end has-text-centered">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item navbar-logo" title="Logo">
          {/* clack studio
          <div className="crossed-line logo"></div> */}
          <img
            src={boldLogo}
            className="svg-navbar-logo"
            alt="clack studio logo"
          />
        </Link>
      </div>
    </div>
  );
};

const DesktopNavMenu = ({ navItems, halfpage }) => (
  <div id="navMenu" className={`navbar-menu`}>
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
);

const MobileNavMenu = ({ navItems }) => {
  const { mobileMenuIsOpen, setMobileMenu } = useNavigationStore();
  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore();

  // close menu on route switch
  useEffect(() => {
    return globalHistory.listen(({ action }) => {
      if (action === "PUSH") setMobileMenu(false);
    });
  }, [setMobileMenu]);

  const handleMenuClick = () => {
    setCurrentHoveredBar(null);
    setMobileMenu(!mobileMenuIsOpen);
  };

  return (
    <div id="navMenu" className={`navbar-menu mobile-navbar-menu `}>
      <div className="navbar-item navbar-start has-text-centered">
        <CrossButton onClick={handleMenuClick}> menu </CrossButton>
      </div>
      <div className={`fullscreen-menu ${mobileMenuIsOpen && "open"}`}>
        {navItems
          .filter((item) => item.shownOnHome)
          .map((item, index) => (
            <div className="mobile-nav-item" key={`mobile-nav-item-${index}`}>
              <Link
                activeClassName={"active"}
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
  );
};

const Navbar = ({ halfpage }) => {
  const { navItems, mobileMenuIsOpen } = useNavigationStore();
  const breakpoints = useBreakpoint();
  return (
    <nav
      className={`navbar is-transparent ${breakpoints.sm && "mobile-nav"} ${
        mobileMenuIsOpen && "no-filter"
      }`}
      role="navigation"
      aria-label="main-navigation"
    >
      {breakpoints.sm ? (
        <MobileNavMenu navItems={navItems} />
      ) : (
        <DesktopNavMenu navItems={navItems} halfpage={halfpage} />
      )}
    </nav>
  );
};

export default Navbar;
export { NavbarLogo };
