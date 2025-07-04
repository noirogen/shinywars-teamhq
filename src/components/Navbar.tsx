import { useState } from "react";
import { NavLink } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseLargeFill } from "react-icons/ri";

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Stats", to: "/stats" },
  { label: "Profile", to: "/profile" },
];

const styles = {
  link: "py-1 px-2 rounded-md transition-colors duration-700 block",
  active: "bg-white text-slate-800",
  inactive: "hover:bg-white hover:text-slate-800 text-white",
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderLinks = () =>
    navLinks.map((link) => (
      <li key={link.label}>
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : styles.inactive}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          {link.label}
        </NavLink>
      </li>
    ));

  return (
    <nav className="bg-slate-800 text-white p-3 z-100">
      <div className="flex justify-between container items-center mx-auto">
        <img
          src="/src/assets/images/coneheads.png"
          alt="Logo"
          className="w-36"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">{renderLinks()}</ul>

        {/* Hamburger Toggle */}
        <div className="md:hidden cursor-pointer">
          {isMenuOpen ? (
            <RiCloseLargeFill
              size={20}
              onClick={() => setIsMenuOpen(false)}
            />
          ) : (
            <GiHamburgerMenu
              size={20}
              onClick={() => setIsMenuOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="md:hidden flex flex-col text-center space-y-3 mt-4">
          {renderLinks()}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
