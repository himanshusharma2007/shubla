import { NavLink, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';

const Sidebar = () => {

  const navigate = useNavigate()

  const handleLogout = async() =>{
    try {
      await adminService.logOutAdmin()
      navigate("/adminlogin")
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="h-screen w-full bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Subhla</div>
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
              to="/tents" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
              Add Camps
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/rooms" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
             Add Rooms
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/parkingmanagement" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
             Parking
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/bookingmanagement" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
             Booking
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/uploadImage" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
            >
             Upload Images
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
        <button onClick={handleLogout} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;