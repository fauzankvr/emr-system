import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  "Home",
  "Welcome",
  "Process",
  "Features",
  "Benefits",
  "Enroll Now",
];

const Navbar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const handleNavClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close mobile menu when clicking or tapping outside
  const handleOutsideClick = useCallback(
    (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  // Add event listeners for mouse and touch events
  useEffect(() => {
    const handleEvents = (e) => handleOutsideClick(e);
    document.addEventListener("mousedown", handleEvents);
    document.addEventListener("touchstart", handleEvents);
    return () => {
      document.removeEventListener("mousedown", handleEvents);
      document.removeEventListener("touchstart", handleEvents);
    };
  }, [handleOutsideClick]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Close menu on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Run on mount to set initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync with system theme preference on mount (optional)
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (window.innerWidth < 768 && prefersDark) {
      // Optionally set light theme on mobile even if system prefers dark
      // setTheme("light");
    }
  }, [setTheme]);

  return (
    <nav
      className="bg-[#0d1b2a]/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-20 py-4 flex justify-between items-center border-b border-white/10"
      ref={navRef}
      aria-label="Main navigation"
    >
      <a
        href="#home"
        className="text-2xl font-bold text-[#f1faee] flex items-center"
        aria-label="Suhaim Soft Home"
      >
        <img src="/main_icon.png"  width={"30px"} height={"30px"} className="mr-2"/>
        SUHAIM SOFT
      </a>

      <div className="flex items-center gap-4 md:gap-6">
        <ul
          className={`
            md:flex md:flex-row md:items-center md:gap-6
            ${
              isOpen
                ? "fixed top-0 left-0 w-full h-screen bg-[#1b263b] flex flex-col items-center justify-center gap-8 translate-x-0"
                : "hidden md:flex"
            }
            transition-transform duration-300 ease-in-out
          `}
          role="menubar"
        >
          {NAV_ITEMS.map((item) => (
            <li key={item} role="none">
              <a
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[#f1faee] text-lg hover:text-[#00a896] relative group"
                onClick={handleNavClick}
                role="menuitem"
                aria-label={`${item} section`}
              >
                {item}
                <span className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#00a896] group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
          ))}
          <li role="none">
            <Link
              to="/lab/login"
              className="text-[#f1faee] text-lg hover:text-[#00a896]"
              // onClick={handleNavClick}
              role="menuitem"
              aria-label="Lab login"
            >
              Lab Login
            </Link>
          </li>
          
          <li role="none">
            <Link
              to="/doctor/login"
              className="text-[#f1faee] text-lg hover:text-[#00a896]"
              onClick={handleNavClick}
              role="menuitem"
              aria-label="Doctor login"
            >
             Doctor Login
            </Link>
          </li>
        </ul>

        {/* <div className="relative inline-block w-14 h-7 md:w-12 md:h-6">
          <input
            type="checkbox"
            id="theme-toggle"
            className="sr-only"
            checked={theme === "dark"}
            onChange={handleThemeToggle}
            aria-label={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } theme`}
          />
          <label
            htmlFor="theme-toggle"
            className="block w-full h-full bg-gray-600 rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00a896] focus:ring-opacity-50"
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-6 h-6 md:w-5 md:h-5 bg-white rounded-full 
                transition-transform duration-300 flex items-center justify-center
                ${theme === "dark" ? "translate-x-7 md:translate-x-6" : ""}
              `}
            >
              <svg
                className="w-4 h-4 md:w-3 md:h-3"
                fill={theme === "dark" ? "#000" : "#fff"}
                viewBox="0 0 24 24"
              >
                {theme === "dark" ? (
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                ) : (
                  <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.93 4.93a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42zm14.14 14.14a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42zM2 12a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm18 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-2.07-7.07a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42zM6.36 17.78a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42z" />
                )}
              </svg>
            </span>
          </label>
        </div> */}

        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2 focus:outline-none focus:ring-2 focus:ring-[#00a896] focus:ring-opacity-50"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span
            className={`
              w-7 h-0.5 bg-[#f1faee] rounded transition-all duration-300
              ${isOpen ? "rotate-45 translate-y-2" : ""}
            `}
          ></span>
          <span
            className={`
              w-7 h-0.5 bg-[#f1faee] rounded transition-opacity duration-300
              ${isOpen ? "opacity-0" : ""}
            `}
          ></span>
          <span
            className={`
              w-7 h-0.5 bg-[#f1faee] rounded transition-all duration-300
              ${isOpen ? "-rotate-45 -translate-y-2" : ""}
            `}
          ></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
