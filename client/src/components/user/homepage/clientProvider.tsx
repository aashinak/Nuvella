"use client";

import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import store from "@/store/userStore";
import { Toaster as Toast } from "@/components/ui/sonner";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
      <Toast richColors className="sm:hidden" position="top-center" />
      <Toast richColors className="hidden sm:block" />
    </Provider>
  );
}
