"use client";
import React, { ReactNode } from "react";
import AdminNavbar from "@/components/admin/homeLayout/adminNavbar";
import AdminSidebar from "@/components/admin/homeLayout/adminSidebar";
import LayoutContentWraper from "@/components/admin/homeLayout/layoutContentWraper";
import LayoutWraper from "@/components/admin/homeLayout/layoutWraper";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
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
