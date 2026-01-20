import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.getUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      toast.error('Image size must be less than 1MB');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await api.uploadProfileImage(formData);
      setUser(response.data.user);
      toast.success('Profile image updated successfully!');
      setShowProfileMenu(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload profile image');
    }
  };

  return (
    <header className="bg-darker border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* App Name */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">GMS</h1>
          <span className="text-sm text-gray-400 hidden sm:block">Garbage Management System</span>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-gray-300 hidden md:block">
                Welcome, {user.name}
              </span>

              {/* Profile Image with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.profileImage ? `http://localhost:5001${user.profileImage}` : '/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzNzM3MzkiLz4KPHBhdGggZD0iTTE2IDE2QzE4LjIxIDE2IDIwIDE0LjIxIDIwIDEyQzIwIDEwLjc5IDE4LjIxIDkgMTYgOUMxMy43OSA5IDEyIDEwLjc5IDEyIDEyQzEyIDE0LjIxIDEzLjc5IDE2IDE2WiIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTAgMjJDMTAgMTkuMzkgMTEuNzkgMTggMTQgMThIMThDMTkuMzkgMTggMjEgMTkuMzkgMjEgMjJWMTguNUMyMSAxNy4xMiAxOS43NSAxNiAxOC4zNSAxNkMxNiAxNiAxNC42NSAxNy4xMiAxNC42NSAxOC41VjIySDEwWiIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=';
                    }}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-darker border border-gray-700 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>

                      <label className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                        />
                        Change Profile Picture
                      </label>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;