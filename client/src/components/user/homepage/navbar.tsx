"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  ChevronsUpDown,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUserCategoryData } from "@/store/user/hooks/useUserCategoryData";
import { useDebounce } from "@/hooks/useDebounce"; // A custom hook for debouncing
import { getProductNames } from "@/api/user/product/product";
import { useUserData } from "@/store/user/hooks/useUserData";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { userLogout } from "@/api/user/auth/auth";

function Navbar() {
  const router = useRouter();
  const { isLoggedIn, userData, logoutUser } = useUserData();
  const { userCategoryData } = useUserCategoryData();

  // Local state for category selection and search keyword
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu

  const debouncedKeyword = useDebounce(keyword, 500); // Debouncing search
  const fetchProductNames = useCallback(async () => {
    try {
      const res = await getProductNames(
        selectedCategory || "",
        debouncedKeyword
      );
      setSearchResult(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [debouncedKeyword, selectedCategory]);

  const handleLogout = async () => {
    try {
      const res = await userLogout();
      if (res.success) {
        localStorage.removeItem("truthy");
        logoutUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (debouncedKeyword.length > 1) {
      fetchProductNames();
    }
  }, [debouncedKeyword, fetchProductNames, selectedCategory]);

  // Memoize category list for optimization
  const categoryList = useMemo(() => {
    return userCategoryData?.map((category) => (
      <CommandItem
        key={category._id}
        value={category._id}
        onSelect={(currentValue) => {
          setSelectedCategory(
            currentValue === selectedCategory ? null : currentValue
          );
          setPopoverOpen(false);
        }}
      >
        <span>{category.name}</span>
        <Check
          className={cn(
            "ml-auto",
            selectedCategory === category._id ? "opacity-100" : "opacity-0"
          )}
        />
      </CommandItem>
    ));
  }, [userCategoryData, selectedCategory]);

  // Event handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // Close mobile menu on any click
  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  // Close mobile menu when screen size changes to larger than `md`
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="w-full h-[10vh] px-5 md:px-16 border border-[#808080] border-opacity-20 py-4 flex items-center justify-between">
      <h1
        onClick={() => router.push("/")}
        className="font-italiana font-bold text-2xl md:text-3xl tracking-widest cursor-pointer"
      >
        Nuvella.com
      </h1>
      <div className="xl:w-3/4 w-1/2 md:h-12 h-10 hidden border border-[#808080] border-opacity-50 md:flex items-center rounded-lg p-0.5">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="md:w-1/5 border-none hidden xl:flex rounded-r-none h-full justify-between shadow-none"
            >
              {selectedCategory
                ? userCategoryData?.find(
                    (category) => category._id === selectedCategory
                  )?.name
                : "All categories"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>{categoryList}</CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="relative md:w-4/5 h-full">
          <Input
            onChange={handleSearchChange}
            value={keyword}
            placeholder="Search"
            className="w-full h-full border-none rounded-l-none"
          />
          {keyword.length > 2 && (
            <div className="w-4/5 bg-white absolute top-12 z-20 h-96 p-2 border">
              <motion.div
                key="results-container"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                Results
                {searchResult.length > 0 ? (
                  searchResult.map((result, index) => (
                    <p key={index}>{result}</p>
                  ))
                ) : (
                  <div>No results</div>
                )}
              </motion.div>
            </div>
          )}
        </div>
        {keyword.length > 2 && (
          <X className="cursor-pointer" onClick={() => setKeyword("")} />
        )}
      </div>
      <div className="flex items-center gap-7">
        <Search className="text-[#808080] md:hidden" />
        <ShoppingCart
          onClick={() => router.push("/cart")}
          className="text-[#808080] cursor-pointer"
        />
        <Bell className="text-[#808080] md:inline hidden cursor-pointer" />
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-9 h-9 rounded-full hidden relative md:flex items-center justify-center cursor-pointer">
                {userData?.avatar ? (
                  <Image
                    className="object-cover rounded-full"
                    alt="userAvatar"
                    src={userData.avatar}
                    fill
                    quality={60}
                    sizes="36px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 text-white font-bold text-lg flex items-center justify-center rounded-full">
                    {userData?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 mt-4 z-100">
              <DropdownMenuItem className="border font-bold antialiased">
                Hey {userData?.username} 👋
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")}>
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/address")}>
                Address
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 hover:text-red-600"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {isLoggedIn && (
          <Menu
            className="text-[#808080] md:hidden cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        )}
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed  inset-0 h-[90vh] top-[10vh] w-full bg-white shadow-md z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-center justify-center gap-5 p-4">
              <li
                className="text-lg cursor-pointer font-semibold hover:text-blue-500 transition-colors duration-200"
                onClick={() => {
                  router.push("/profile");
                  closeMobileMenu();
                }}
              >
                Profile
              </li>
              <li
                className="text-lg font-semibold hover:text-blue-500 transition-colors duration-200"
                onClick={() => {
                  router.push("/orders");
                  closeMobileMenu();
                }}
              >
                Orders
              </li>
              <li
                className="text-lg font-semibold hover:text-blue-500 transition-colors duration-200"
                onClick={() => {
                  router.push("/address");
                  closeMobileMenu();
                }}
              >
                Address
              </li>
              <li
                className="text-red-600 text-lg font-semibold hover:text-red-700 transition-colors duration-200"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              >
                Logout
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
