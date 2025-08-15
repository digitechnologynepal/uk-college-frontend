import { LogOut, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const AdminNavbar = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");

  function logout() {
    Swal.fire({
      title: "Are you sure you want to log out?",
      text: "You need to enter your credentials to login again!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.replace("/login");
      }
    });
  }

  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      setTitle("Institution Profile");
    } else if (location.pathname === "/admin/banner") {
      setTitle("Banner Section");
    } else if (location.pathname === "/admin/aboutus") {
      setTitle("About Us");
    } else if (location.pathname === "/admin/achievements") {
      setTitle("Mission and Vision");
    } else if (location.pathname === "/admin/whychooseus") {
      setTitle("Why Choose Us");
    } else if (location.pathname === "/admin/manage-gallery") {
      setTitle("Manage Gallery");
    } else if (location.pathname === "/admin/manage-group") {
      setTitle("Manage Group");
    } else if (location.pathname === "/admin/manage-team-members") {
      setTitle("Manage Team Members");
    } else if (location.pathname === "/admin/manage-clients") {
      setTitle("Manage Clients");
    } else if (location.pathname === "/admin/categories") {
      setTitle("Manage Categories");
    } else if (location.pathname === "/admin/manage-courses") {
      setTitle("Manage Courses");
    } else if (location.pathname === "/admin/course-application") {
      setTitle("Test Preparation Application");
    } else if (location.pathname === "/admin/queries") {
      setTitle("Queries");
    }
  }, [location]);

  return (
    <>
      <div className="w-full flex justify-between bg-gray-50 p-4">
        <button className="lg:hidden">
          <Menu />
        </button>
        <h1 className="text-2xl font-medium">{title}</h1>
        <button onClick={logout}>
          <LogOut />
        </button>
      </div>
    </>
  );
};
