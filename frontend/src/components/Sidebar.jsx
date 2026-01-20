import { logout } from '../utils/auth';
import toast from 'react-hot-toast';

const Sidebar = ({ user, setUser }) => {
  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { label: 'Dashboard', active: true },
    // Add more menu items if needed
  ];

  return (
    <div className="w-64 bg-darker border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-primary">GMS</h1>
        <p className="text-sm text-gray-400">{user.role} Dashboard</p>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <a
                href="#"
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  item.active
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;