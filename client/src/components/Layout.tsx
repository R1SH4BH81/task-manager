import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSocket, disconnectSocket } from "../utils/socket";
import { api } from "../utils/api";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await api.authenticatedRequest(api.profile, {
          method: "GET",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // Connect to socket
          getSocket();
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    disconnectSocket();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/dashboard"
                  className="text-xl font-semibold text-indigo-600"
                >
                  TaskManager
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="nav-link-inactive">
                  Dashboard
                </Link>
                <Link to="/tasks" className="nav-link-inactive">
                  Tasks
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative flex items-center space-x-4">
                {user && (
                  <span className="text-sm text-gray-700 hidden md:inline">
                    {user.name}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button would go here if needed */}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="nav-link-active block pl-3 pr-4 py-2 border-l-4"
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className="nav-link-inactive block pl-3 pr-4 py-2 border-l-4"
            >
              Tasks
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-medium">
                    {user ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                {user && (
                  <div className="text-base font-medium text-gray-800 truncate">
                    {user.name}
                  </div>
                )}
                {user && (
                  <div className="text-sm font-medium text-gray-500 truncate">
                    {user.email}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
