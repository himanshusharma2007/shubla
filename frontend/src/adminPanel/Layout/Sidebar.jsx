import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-bold">MyApp</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow mt-5">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          <FaHome className="mr-3" />
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          <FaUser className="mr-3" />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          <FaCog className="mr-3" />
          Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700">
        <NavLink
          to="/logout"
          className="flex items-center px-4 py-2 hover:bg-gray-700"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
