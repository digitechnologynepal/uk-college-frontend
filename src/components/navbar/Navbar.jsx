import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/uk-colleges-logo.png";
import Logo2 from "../../assets/images/uk-colleges-logo-white.png";
import { Menu, X } from "lucide-react";

export const Navbar = ({ institutionProfile }) => {
  const location = useLocation();
  const desiredPaths = [
    "/login",
    "/admin/dashboard",
    "/admin/aboutus",
    "/admin/achievements",
    "/admin/stats",
    "/admin/manage-gallery",
    "/admin/manage-courses",
    "/admin/course-application",
    "/admin/queries",
    "/admin/whychooseus",
    "/admin/service",
    "/admin/news",
    "/admin/manage-group",
    "/admin/manage-team-members",
    "/admin/procedures",
    "/admin/manage-clients",
  ];

  const isDesiredPath = desiredPaths.includes(location.pathname);

  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  if (isDesiredPath) return null;

  return (
    <>
      {/* Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-20 object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-4">
              {[
                { path: "/", label: "Home" },
                { path: "/aboutus", label: "About Us" },
                { path: "/course", label: "Courses" },
                { path: "/clients", label: "Our Clients" },
                { path: "/galleryview", label: "Gallery" },
                { path: "/news", label: "News" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`navbar-link ${isActive(path) ? "active" : ""}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Button (desktop only) */}
          <Link
            to="/contact"
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out bg-[#d91b1a] text-white hover:bg-[#b71715]"
          >
            Contact Us
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-[#204081]"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <img src={Logo} alt="Logo" className="h-16" />
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-600 hover:text-red-500"
          >
            <X size={28} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-4 text-lg font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/aboutus", label: "About Us" },
              { to: "/course", label: "Courses" },
              { to: "/clients", label: "Our Clients" },
              { to: "/galleryview", label: "Gallery" },
              { to: "/news", label: "News" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-md transition ${
                  isActive(to)
                    ? "bg-[#e7efff] text-[#204081] font-semibold"
                    : "bg-gray-100 text-[#204081]"
                } hover:bg-[#e7efff]`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
