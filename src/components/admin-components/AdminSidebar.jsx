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
  SquareChartGantt,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  const list = [
    {
      label: "banner section",
      icon: <CircleHelp className="size-4" />,
      link: "/admin/banner",
    },
    {
      label: "about us section",
      icon: <Award className="size-4" />,
      link: "/admin/aboutus",
    },
    {
      label: "mission and vision section",
      icon: <Trophy className="size-4" />,
      link: "/admin/achievements",
    },
    {
      label: "manage gallery",
      icon: <Images className="size-4" />,
      link: "/admin/manage-gallery",
    },
    {
      label: "manage group",
      icon: <BookUser className="size-4" />,
      link: "/admin/manage-group",
    },
    {
      label: "manage team members",
      icon: <User className="size-4" />,
      link: "/admin/manage-team-members",
    },
    {
      label: "manage courses",
      icon: <BookOpenCheck className="size-4" />,
      link: "/admin/manage-courses",
    },
    {
      label: "news section",
      icon: <Newspaper className="size-4" />,
      link: "/admin/news",
    },
    {
      label: "manage clients",
      icon: <User className="size-4" />,
      link: "/admin/manage-clients",
    },
    {
      label: "manage categories",
      icon: <List className="size-4" />,
      link: "/admin/categories",
    },
    {
      label: "why choose us section",
      icon: <File className="size-4" />,
      link: "/admin/whychooseus",
    },
    {
      label: "queries section",
      icon: <File className="size-4" />,
      link: "/admin/queries",
    },
  ];

  return (
    <div
      className=" transition-all duration-300 transform hidden top-0 start-0 bottom-0 z-[10] w-80 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block fixed lg:relative lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      role="dialog"
      aria-label="Sidebar"
    >
      <div className="px-6 mb-2">
        <p
          className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80"
          aria-label="Brand"
        >
          The UK Colleges Nepal
        </p>
      </div>
      <nav
        className="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
        data-hs-accordion-always-open
      >
        <ul className="flex flex-col space-y-1.5">
          <li className="w-full">
            <Link
              to={"/admin/dashboard"}
              className={`flex capitalize ${
                location.pathname === "/admin/dashboard" ? "bg-neutral-100" : ""
              } w-full items-center gap-x-3.5 py-2 px-2.5  text-sm text-gray-700 rounded-lg hover:bg-gray-100`}
              href={"/admin"}
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
          {list?.map((value, index) => (
            <li key={index} className="w-full">
              <Link
                className={`flex capitalize ${
                  location?.pathname === value?.link ? "bg-neutral-100" : ""
                } items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100`}
                to={value?.link}
              >
                {value?.icon}
                {value?.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
