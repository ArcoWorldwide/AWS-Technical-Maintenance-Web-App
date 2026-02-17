import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FiGrid,
  FiTool,
  FiPackage,
  FiBatteryCharging,
  FiFileText,
  FiUsers,
  FiActivity
} from "react-icons/fi";
import logo from "../assets/aws-img/logo.png";
import { PERMISSIONS } from "../utils/constants/permissions";

function Navbar({ isMobile, toggleMenu, userPermissions }) {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: FiGrid },
    { name: "Fleet", path: "/dashboard/fleet", icon: FiPackage },
    { name: "Maintenance", path: "/dashboard/maintenance", icon: FiTool },
    { name: "Battery", path: "/dashboard/battery", icon: FiBatteryCharging },
    { name: "Reports", path: "/dashboard/reports", icon: FiFileText },
    { name: "Users", path: "/dashboard/users", icon: FiUsers },
    { name: "Activities", path: "/dashboard/activities", icon: FiActivity },
  ];

  const adminNavItems = [
    {
      name: "Users",
      path: "/dashboard/users",
      icon: FiUsers,
      permission: PERMISSIONS.MANAGE_USERS,
    },
  ];

  const hasPermission = (permission) =>
    Array.isArray(userPermissions) &&
    userPermissions.includes(permission);

  const NavItem = ({ item }) => {
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        end
        onClick={isMobile ? toggleMenu : undefined}
        className={({ isActive }) =>
          `
          group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-200
          ${
            isActive
              ? "bg-[#2F3A8F] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
          ${isMobile ? "text-[11px]" : "text-[12px]"}
        `
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${
                isActive ? "bg-[#2F3A8F]" : "opacity-0"
              }`}
            />

            <div
              className={`flex items-center justify-center rounded-lg
                ${
                  isActive
                    ? "bg-white/15"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }
                ${isMobile ? "w-7 h-7" : "w-8 h-8"}
              `}
            >
              <Icon className={`${isMobile ? "text-sm" : "text-base"}`} />
            </div>

            <span className="truncate">{item.name}</span>
          </>
        )}
      </NavLink>
    );
  };

  /* ================= DESKTOP ================= */
  if (!isMobile) {
    return (
      <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] bg-white border-r flex flex-col">
        <div className="px-5 py-6 flex items-center justify-center">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </div>

        <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}

          {adminNavItems.some((i) => hasPermission(i.permission)) && (
            <>
              <div className="px-3 pt-4 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Admin
              </div>

              {adminNavItems
                .filter((item) => hasPermission(item.permission))
                .map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
            </>
          )}
        </nav>

        <div className="px-5 py-4 text-xs text-gray-400 text-center">
          AWS UAV Maintenance Platform
        </div>
      </aside>
    );
  }

  /* ================= MOBILE ================= */
  return (
    <aside className="h-full bg-white flex flex-col max-w-[220px]">
      <div className="px-4 py-4 flex justify-center">
        <img src={logo} alt="logo" className="w-24 object-contain" />
      </div>

      <nav className="flex-1 px-2 py-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}

        {adminNavItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
      </nav>

      <div className="px-4 py-3 text-[10px] text-gray-400 text-center">
        UAV Maintenance Platform
      </div>
    </aside>
  );
}

Navbar.propTypes = {
  isMobile: PropTypes.bool,
  toggleMenu: PropTypes.func,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Navbar;
