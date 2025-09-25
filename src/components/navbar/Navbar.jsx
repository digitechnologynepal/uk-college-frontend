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
  const [partnersOpen, setPartnersOpen] = useState(false);

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
              {/* Home */}
              <li>
                <Link
                  to="/"
                  className={`navbar-link block w-full px-4 py-2 rounded-lg transition ${
                    isActive("/")
                      ? "bg-[#e7efff] text-[#204081] font-semibold"
                      : "text-[#204081]"
                  } hover:bg-[#e7efff]`}
                >
                  Home
                </Link>
              </li>

              {/* About */}
              <li>
                <Link
                  to="/aboutus"
                  className={`navbar-link block w-full px-4 py-2 rounded-lg transition ${
                    isActive("/aboutus")
                      ? "bg-[#e7efff] text-[#204081] font-semibold"
                      : "text-[#204081]"
                  } hover:bg-[#e7efff]`}
                >
                  About Us
                </Link>
              </li>

              {/* Courses */}
              <li>
                <Link
                  to="/course"
                  className={`navbar-link block w-full px-4 py-2 rounded-lg transition ${
                    isActive("/course")
                      ? "bg-[#e7efff] text-[#204081] font-semibold"
                      : "text-[#204081]"
                  } hover:bg-[#e7efff]`}
                >
                  Courses
                </Link>
              </li>

              {/* Partners Dropdown */}
              <li className="relative">
                <button
                  onClick={() => setPartnersOpen((prev) => !prev)}
                  className="navbar-link flex items-center gap-1 border-none px-4 py-2 rounded-lg hover:bg-[#e7efff] text-[#204081]"
                >
                  Partners
                  <span className="ml-1">
                    {partnersOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>

                <div
                  className={`absolute left-0 mt-2 w-48 bg-white border rounded shadow-md lg:shadow-lg z-50 transform transition-all duration-200
      ${partnersOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
    `}
                >
                  <ul className="flex flex-col gap-0">
                    <li>
                      <Link
                        to="/partners"
                        className="block w-full px-4 py-2 hover:bg-[#e7efff] text-[#204081]"
                      >
                        Our Partners
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/partnercenter"
                        className="block w-full px-4 py-2 hover:bg-[#e7efff] text-[#204081]"
                      >
                        Become a Partner
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/* News */}
              <li>
                <Link
                  to="/news"
                  className={`navbar-link block w-full px-4 py-2 rounded-lg transition ${
                    isActive("/news")
                      ? "bg-[#e7efff] text-[#204081] font-semibold"
                      : "text-[#204081]"
                  } hover:bg-[#e7efff]`}
                >
                  News & Events
                </Link>
              </li>

              {/* Gallery */}
              <li>
                <Link
                  to="/galleryview"
                  className={`navbar-link block w-full px-4 py-2 rounded-lg transition ${
                    isActive("/galleryview")
                      ? "bg-[#e7efff] text-[#204081] font-semibold"
                      : "text-[#204081]"
                  } hover:bg-[#e7efff]`}
                >
                  Gallery
                </Link>
              </li>

              {/* Marketing Dropdown */}
              {institutionProfile?.brochure && (
                <li className="relative">
                  <button
                    onClick={() => setMarketingOpen((prev) => !prev)}
                    className="navbar-link flex items-center gap-1 border-none px-4 py-2 rounded-lg hover:bg-[#e7efff] text-[#204081]"
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
                          className="block w-full text-left px-4 py-2 hover:bg-[#e7efff] text-[#204081]"
                        >
                          Download Brochure
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          </nav>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center justify-end gap-2 flex-shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2 flex items-center font-semibold rounded-lg hover:shadow-md transition-all duration-300 border-2 border-[#d91b1a] text-[#d91b1a] hover:bg-[#d91b1a] hover:text-white"
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
            {/* Home */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-lg transition ${
                isActive("/")
                  ? "bg-[#e7efff] text-[#204081] font-semibold"
                  : "bg-gray-100 text-[#204081]"
              } hover:bg-[#e7efff]`}
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              to="/aboutus"
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-lg transition ${
                isActive("/aboutus")
                  ? "bg-[#e7efff] text-[#204081] font-semibold"
                  : "bg-gray-100 text-[#204081]"
              } hover:bg-[#e7efff]`}
            >
              About Us
            </Link>

            {/* Courses */}
            <Link
              to="/course"
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-lg transition ${
                isActive("/course")
                  ? "bg-[#e7efff] text-[#204081] font-semibold"
                  : "bg-gray-100 text-[#204081]"
              } hover:bg-[#e7efff]`}
            >
              Courses
            </Link>

            {/* Partners Dropdown */}
            <div className="mt-2">
              <button
                className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium focus:outline-none hover:bg-[#e7efff]"
                onClick={() => setPartnersOpen((prev) => !prev)}
              >
                Partners
                <span>
                  {partnersOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </button>

              <div
                className={`px-3 mt-1 overflow-hidden transform transition-all duration-200
      ${partnersOpen ? "max-h-40 translate-y-0" : "max-h-0 -translate-y-2"}
    `}
              >
                <ul className="flex flex-col">
                  <li>
                    <Link
                      to="/partners"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium hover:bg-[#e7efff]"
                    >
                      Our Partners
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/partnercenter"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium hover:bg-[#e7efff]"
                    >
                      Become a Partner
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* News */}
            <Link
              to="/news"
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-lg transition ${
                isActive("/news")
                  ? "bg-[#e7efff] text-[#204081] font-semibold"
                  : "bg-gray-100 text-[#204081]"
              } hover:bg-[#e7efff]`}
            >
              News & Events
            </Link>

            {/* Gallery */}
            <Link
              to="/galleryview"
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-lg transition ${
                isActive("/galleryview")
                  ? "bg-[#e7efff] text-[#204081] font-semibold"
                  : "bg-gray-100 text-[#204081]"
              } hover:bg-[#e7efff]`}
            >
              Gallery
            </Link>

            {/* Marketing Dropdown */}
            {institutionProfile?.brochure && (
              <div className="mt-2">
                <button
                  className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium focus:outline-none hover:bg-[#e7efff]"
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
                        className="block w-full px-4 py-2 rounded-lg bg-gray-100 text-[#204081] font-medium hover:bg-[#e7efff] text-left"
                      >
                        Download Brochure
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contact */}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={`block w-full px-4 py-2 rounded-lg transition ${
                isActive("/contact")
                  ? "bg-[#e7efff] text-[#204081] font-semibold"
                  : "bg-gray-100 text-[#204081]"
              } hover:bg-[#e7efff]`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
