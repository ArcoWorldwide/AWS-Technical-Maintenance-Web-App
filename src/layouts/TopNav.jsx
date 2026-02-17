import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import Navbar from "./Navbar";
import { getTitle } from "../utils/titleUtils";
import logo from "../assets/aws-img/logo.png";


export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const pageTitle = useMemo(() => {
    const title = getTitle(location.pathname);

    if (!title || title.toLowerCase() === "welcome") {
    const map = {
      "/dashboard": "Dashboard",
      "/dashboard/maintenance": "Maintenance",
      "/dashboard/fleet": "Fleet",
      "/dashboard/battery": "Battery",
      "/dashboard/reports": "Reports",
    };

      return map[location.pathname] || "Dashboard";
    }

    return title;
  }, [location.pathname]);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Navbar isMobile={false} />
      </div>

      {/* TOP BAR */}
      <header
        className="
          bg-[#3C498B]
          text-white
          md:ml-[220px]
          w-full
          shadow-sm
          h-[72px] sm:h-[90px] md:h-[130px] lg:h-[150px]
          flex items-center
          px-4 sm:px-6 md:px-12
        "
      >
        <div className="flex items-center justify-between w-full">
          {/* MOBILE: LOGO + PAGE NAME */}
          <div className="flex items-center gap-3">
            {/* LOGO (MOBILE ONLY) */}
{/* LOGO (MOBILE ONLY) */}
<div className="md:hidden bg-white rounded-md p-1.5">
  <Link to="/dashboard">
    <img
      src={logo}
      alt="logo"
      className="w-7 h-7 object-contain cursor-pointer"
    />
  </Link>
</div>

            {/* PAGE NAME */}
            <h1
              className="
                text-[14px]
                sm:text-[16px]
                md:text-2xl
                font-semibold
                tracking-tight
                truncate
              "
            >
              {pageTitle}
            </h1>
          </div>

          {/* DESKTOP PROFILE */}
          <div className="hidden md:flex">
            <button className="bg-white text-[#3C498B] p-3 rounded-full text-xl hover:scale-105 transition">
              <MdPerson />
            </button>
          </div>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <FaBars
              onClick={toggleMenu}
              className="text-xl cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* MOBILE SPACER */}
      <div className="md:hidden h-3" />

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white text-[#3C498B]
          transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          z-50 shadow-xl
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <FaTimes
            onClick={toggleMenu}
            className="text-xl cursor-pointer"
          />
        </div>

        <Navbar isMobile toggleMenu={toggleMenu} />
      </aside>

      {/* OVERLAY */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
