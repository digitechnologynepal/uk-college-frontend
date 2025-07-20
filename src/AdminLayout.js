import React from "react";
import AdminSidebar from "./components/admin-components/AdminSidebar";
import { AdminNavbar } from "./components/admin-components/AdminNavbar";

function AdminLayout({ children }) {
  return (
    <>
      <div className="flex bg-white min-h-screen">
        <AdminSidebar />
        <div className="min-h-screen w-full">
          <AdminNavbar />
          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
