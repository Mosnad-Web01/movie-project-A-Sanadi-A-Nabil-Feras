"use client"

// react & next imports 
  import { useState, useEffect } from "react";
  import Image from "next/image";
  import Link from "next/link";

// third-party imports
  import { MenuIcon, SearchIcon } from "@heroicons/react/solid";
  import { FaMoon, FaSun } from "react-icons/fa";

// component imports 
  import Sidebar from "./Sidebar";
  import LinkDropdown from "./LinkDropdown";
  import ProfileDropdown from "./ProfileDropdown";
  import SearchBar from "./SearchBar";

// local relative imports   
  import { logo } from '@/util/constants'; 
  import { fetchGenres } from "@/services/fetchGenres";
  import { useDarkMode } from "@/hooks/useDarkMode";

// Centralized navLinks data
const NAV_LINKS_TEMPLATE = [
  { label: "Genres", dropdownItems: [] },
  {
    label: "Movies",
    href: "movie",
    dropdownItems: ["Popular", "Top Rated", "Upcoming", "Now Playing"],
  },
  {
    label: "TV Shows",
    href: "tv",
    dropdownItems: ["Popular", "Airing Today", "On The Air", "Top Rated"],
  },
]


const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(NAV_LINKS_TEMPLATE);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

 // Fetch genres and update the navLinks
 useEffect(() => {
  const updateNavLinksWithGenres = async () => {
    const movieGenres = await fetchGenres() // Return an array of genre names
    setNavLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (link.label === "Genres") {
          return { ...link, dropdownItems: movieGenres }
        }
        return link
      }),
    )
  }

  updateNavLinksWithGenres()
}, [])  

  return (
    <header className="bg-gray-200 dark:bg-gray-900 text-[#032541] dark:text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
       <div className="flex  items-center gap-12">
          {/* Hamburger Icon */}
          <div className="md:hidden">
            <MenuIcon
              className="w-6 h-6 cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>

          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#5fcde4] lg:hidden">
                TMDB
              </span>
              <Image
                className="w-36 h-5 hidden lg:block"
                src={logo}
                alt="Logo"
              />
            </div>
          </Link>

          {/* Links with dropdowns */}
          <div className="hidden md:flex space-x-4 text-sm font-medium">
            {navLinks.map((link, index) => (
              <LinkDropdown
                key={index}
                label={link.label}
                dropdownItems={link.dropdownItems}
                href={link.href}
                dropdownItemshref={link.dropdownItemshref}
              />
            ))}
            {/* Actors*/}
            <Link
              href="/actors"
              className="hover:text-[#01b4e4] flex items-center  text-lg font-semibold "
            >
              Actors
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <SearchIcon
            className="w-6 h-6 hover:text-[#01b4e4] cursor-pointer  md:block"
            onClick={toggleSearch}
          />
          <ProfileDropdown />
          <button
            onClick={toggleDarkMode}
            className="bg-[#01b4e4] rounded-full px-3 py-1 text-white"
          >
            {darkMode ? (
              <FaSun className="text-xl" />
            ) : (
              <FaMoon className="text-xl" />
            )}
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navLinks={navLinks}
      />

      {/* SearchBar */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;