import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbCards } from "react-icons/tb";
import {
  Award,
  CircleHelp,
  File,
  Images,
  Trophy,
  List,
  BookOpenCheck,
  Newspaper,
  BookUser,
  User,
} from "lucide-react";

function AdminSidebar() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const list = [
    { label: "banner section", icon: <CircleHelp className="size-4" />, link: "/admin/banner" },
    { label: "about us section", icon: <Award className="size-4" />, link: "/admin/aboutus" },
    { label: "mission and vision section", icon: <Trophy className="size-4" />, link: "/admin/motto" },
    { label: "manage gallery", icon: <Images className="size-4" />, link: "/admin/manage-gallery" },
    { label: "manage group", icon: <BookUser className="size-4" />, link: "/admin/manage-group" },
    { label: "manage team members", icon: <User className="size-4" />, link: "/admin/manage-team-members" },
    { label: "manage testimonial", icon: <TbCards className="size-4" />, link: "/admin/manage-testimonial" },
    { label: "manage courses", icon: <BookOpenCheck className="size-4" />, link: "/admin/manage-courses" },
    { label: "news section", icon: <Newspaper className="size-4" />, link: "/admin/news" },
    { label: "manage clients", icon: <User className="size-4" />, link: "/admin/manage-clients" },
    { label: "manage categories", icon: <List className="size-4" />, link: "/admin/categories" },
    { label: "why choose us section", icon: <File className="size-4" />, link: "/admin/whychooseus" },
    { label: "queries section", icon: <File className="size-4" />, link: "/admin/queries" },
  ];

  return (
    <>
      {/* Hamburger button only when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="lg:hidden fixed top-4 left-4 z-[20] p-2 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`transition-transform duration-300 fixed top-0 left-0 bottom-0 z-[10] w-80 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:block
        `}
      >
        <div className="px-6 mb-2 flex items-center justify-between">
          <p className="flex-none font-semibold text-xl text-black">The UK Colleges Nepal</p>

          {/* Close button only on mobile */}
          <button
            className="lg:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-3 w-full flex flex-col">
          <ul className="flex flex-col space-y-1.5">
            {/* Dashboard Link */}
            <li className="w-full">
              <Link
                to={"/admin/dashboard"}
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100
                  ${location.pathname === "/admin/dashboard" ? "bg-neutral-100" : ""}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </Link>
            </li>

            {/* Other Links */}
            {list.map((value, index) => (
              <li key={index} className="w-full">
                <Link
                  to={value.link}
                  className={`flex capitalize items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100
                    ${location.pathname === value.link ? "bg-neutral-100" : ""}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {value.icon}
                  {value.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default AdminSidebar;
