import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/ukcolleges.png";
import { Menu, X, Download, Phone } from "lucide-react";

export const Navbar = ({ institutionProfile }) => {
  const location = useLocation();
  const desiredPaths = [
    "/login",
    "/admin/dashboard",
    "/admin/aboutus",
    "/admin/banner",
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
    "/admin/manage-clients",
    "/admin/categories",
  ];

  const isDesiredPath = desiredPaths.includes(location.pathname);

  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const brochureFileName = institutionProfile?.brochure?.split("/")?.pop();
  const isMobile = window.innerWidth < 1024;

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

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/uploads/${institutionProfile.brochure}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const fileNameRaw =
        institutionProfile?.brochure?.split("/")?.pop() || "brochure.pdf";
      const fileName = fileNameRaw.replace(/^\d+_/, ""); // Remove leading digits + underscore

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      {/* Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between py-2 px-4 lg:px-8">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-16 object-contain" />
            </Link>
          </div>

          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <ul className="flex">
              {[
                { path: "/", label: "Home" },
                { path: "/aboutus", label: "About Us" },
                { path: "/course", label: "Courses" },
                { path: "/clients", label: "Our Clients" },
                { path: "/galleryview", label: "Gallery" },
                { path: "/news", label: "News & Events" },
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

          <div className="hidden lg:flex items-center justify-end gap-2 flex-shrink-0">
            {institutionProfile?.brochure && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 flex items-center font-semibold transition-all duration-300 text-[#204081] hover:bg-[#e7efff] hover:rounded-full"
              >
                <Download size={20} className="mr-2" />
                Brochure
              </button>
            )}
            <Link
              to="/contact"
              className="px-4 py-2 flex items-center font-semibold rounded-full shadow-md transition-all duration-300 bg-[#d91b1a] text-white hover:bg-[#b71715]"
            >
              <Phone size={20} className="mr-2" />
              Contact Us
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-[#204081] ml-auto"
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
          <div className="space-y-2 text-md font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/aboutus", label: "About Us" },
              { to: "/course", label: "Courses" },
              { to: "/clients", label: "Our Clients" },
              { to: "/galleryview", label: "Gallery" },
              { to: "/news", label: "News & Events" },
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

          {institutionProfile?.brochure && (
            <div className="mt-2 px-4 py-2 rounded-md bg-gray-100 text-[#204081]">
              <button
                onClick={handleDownload}
                className="mb-1 text-md font-medium"
              >
                Download Brochure
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
