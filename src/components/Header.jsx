import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Header.css";

const navLinks = [
    { to: "/", label: "דף הבית" },
    { to: "/gallery", label: "גלריה" },
    { to: "/reviews", label: "חוות דעת" },
    { to: "/about", label: "אודותינו" },
    { to: "/contact", label: "צור קשר" },
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNavClick = () => setMenuOpen(false);

    return (
        <header
            className="shadow-sm"
            style={{
                minHeight: 90,
                background: "var(--color-primary)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
        >
            <div
                className="container-fluid d-flex align-items-center justify-content-between"
                style={{ height: 90 }}
            >
                <Link to="/" className="d-flex align-items-center ">
                    <img
                        src="/images/logo.jpg"
                        alt="logo"
                        style={{
                            height: 48,
                            width: "auto",
                            borderRadius: 8,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                        }}
                    />
                </Link>

                {/* ניווט מרכזי בדסקטופ */}
                <nav className="d-none d-md-flex flex-grow-1 justify-content-center ">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="nav-link custom-nav-link mx-2 "
                            onClick={handleNavClick}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* המבורגר במובייל */}
                <button
                    className="btn d-md-none position-relative"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="menu"
                    style={{ zIndex: 1100, background: "transparent", border: "none", color: "var(--color-title-pink)" }}
                >
                    <span className={`burger-anim ${menuOpen ? "open" : ""}`}>
                        {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
                    </span>
                </button>
            </div>

            {/* דרופדאון במובייל */}
            <div
                className={` bg-primary w-100 mobile-dropdown ${menuOpen ? "open" : ""}`}
                style={{
                    transition: "max-height 0.4s",
                    // background: "var(--color-primary)",
                    overflow: "hidden",
                    maxHeight: menuOpen ? "350px" : "0px",
                }}
            >
                <nav className="d-flex flex-column align-items-center py-2" >
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="nav-link custom-nav-link w-100 text-center  "
                            style={{ borderRadius: 0 }}
                            onClick={handleNavClick}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;