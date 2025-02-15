import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  CircleFadingArrowUp,
  Container,
  Plus,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <ChartNoAxesCombined /> },
    { name: "Products", path: "/admin/products", icon: <ShoppingBag /> },
    { name: "Orders", path: "/admin/orders", icon: <Container /> },
    { name: "UI Update", path: "/admin/ui-update", icon: <CircleFadingArrowUp /> },
    { name: "Add Admin", path: "/admin/add-admin", icon: <Plus /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-92vh bg-[#f5f5f5]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-3  text-black border-b"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-full transition-all duration-300 ease-in-out   flex flex-col ${
          isOpen ? "w-60 px-4 py-6" : "w-16 px-2 py-6"
        }`}
      >
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger>
              <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 transition-all duration-150 ease-in-out px-2 py-2 rounded-lg ${
                isActive(item.path)
                  ? "bg-[#909090] text-white"
                  : "text-[#404040] hover:bg-[#909090] hover:text-white"
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6">
                {item.icon}
              </span>
              {isOpen && (
                <span className="text-sm font-medium truncate">
                  {item.name}
                </span>
              )}
            </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
            
          ))}
        </nav>
      </div>
    </div>
  );
}

export default AdminSidebar;
