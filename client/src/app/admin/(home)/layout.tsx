"use client"
import AdminNavbar from "@/components/admin/homeLayout/adminNavbar";
import AdminSidebar from "@/components/admin/homeLayout/adminSidebar";
import LayoutContentWraper from "@/components/admin/homeLayout/layoutContentWraper";
import LayoutWraper from "@/components/admin/homeLayout/layoutWraper";

import React from "react";

function Layout({ children }) {
  return (
    <LayoutWraper>
      <AdminNavbar />
      <LayoutContentWraper>
        <AdminSidebar />
        {children}
      </LayoutContentWraper>
    </LayoutWraper>
  );
}

export default Layout;
