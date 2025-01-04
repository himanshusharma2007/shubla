import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Shubhla</div>
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/services" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contactAdminPanel" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;