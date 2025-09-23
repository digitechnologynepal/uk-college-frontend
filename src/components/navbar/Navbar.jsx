import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/ukcolleges.png";
import { Menu, X, Phone, ChevronDown, ChevronUp } from "lucide-react";

export const Navbar = ({ institutionProfile }) => {
  const location = useLocation();
  const desiredPaths = [
    "/login",
    "/admin/dashboard",
    "/admin/aboutus",
    "/admin/banner",
    "/admin/motto",
    "/admin/manage-gallery",
    "/admin/manage-courses",
    "/admin/queries",
    "/admin/whychooseus",
    "/admin/news",
    "/admin/manage-group",
    "/admin/manage-team-members",
    "/admin/manage-testimonial",
    "/admin/manage-clients",
    "/admin/categories",
  ];

  const isDesiredPath = desiredPaths.includes(location.pathname);

  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);

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
      const fileName = fileNameRaw.replace(/^\d+_/, "");

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
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md ">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between py-2 px-4 lg:px-8">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-16 object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <ul className="flex items-center gap-4 justify-center">
              {[
                { path: "/", label: "Home" },
                { path: "/aboutus", label: "About Us" },
                { path: "/course", label: "Courses" },
                { path: "/partners", label: "Our Partners" },
                { path: "/galleryview", label: "Gallery" },
                { path: "/news", label: "News & Events" },
                { path: "/partnercenter", label: "Partner Center" },
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

              {/* Marketing Dropdown */}
              {institutionProfile?.brochure && (
                <li className="relative">
                  <button
                    onClick={() => setMarketingOpen((prev) => !prev)}
                    className="navbar-link flex items-center gap-1 border-none"
                  >
                    Marketing
                    <span className="ml-1">
                      {marketingOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  </button>

                  <div
                    className={`absolute left-0 mt-2 w-48 bg-white border rounded shadow-md lg:shadow-lg z-50 transform transition-all duration-200
                    ${
                      marketingOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-2 opacity-0"
                    }
                  `}
                  >
                    <ul className="flex flex-col">
                      <li>
                        <button
                          onClick={handleDownload}
                          className="w-full text-left px-4 py-2 hover:bg-[#e7efff] text-[#204081]"
                        >
                          Download Brochure
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              )}

              {/* more items here in the future */}
            </ul>
          </nav>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center justify-end gap-2 flex-shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2 flex items-center font-semibold rounded-lg shadow-md transition-all duration-300 bg-[#d91b1a] text-white hover:bg-[#b71715]"
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

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-50 shadow-md  transform transition-transform duration-300 ${
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

        {/* Drawer Navigation */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-2 text-md font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/aboutus", label: "About Us" },
              { to: "/course", label: "Courses" },
              { to: "/partners", label: "Our Partners" },
              { to: "/galleryview", label: "Gallery" },
              { to: "/news", label: "News & Events" },
              { to: "/contact", label: "Contact" },
              { to: "/partnercenter", label: "Become a Partner" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive(to)
                    ? "bg-[#e7efff] text-[#204081] font-semibold"
                    : "bg-gray-100 text-[#204081]"
                } hover:bg-[#e7efff]`}
              >
                {label}
              </Link>
            ))}

            {/* Mobile Marketing Dropdown */}
            {institutionProfile?.brochure && (
              <div className="mt-2">
                <button
                  className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium focus:outline-none"
                  onClick={() => setMarketingOpen((prev) => !prev)}
                >
                  Marketing
                  <span>
                    {marketingOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>

                <div
                  className={`px-3 mt-1 overflow-hidden transform transition-all duration-200
                  ${
                    marketingOpen
                      ? "max-h-40 translate-y-0"
                      : "max-h-0 -translate-y-2"
                  }
                `}
                >
                  <ul className="flex flex-col">
                    <li>
                      <button
                        onClick={handleDownload}
                        className="block w-full items-center px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium"
                      >
                        Download Brochure
                      </button>
                    </li>
                    {/* more items here in the future */}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
