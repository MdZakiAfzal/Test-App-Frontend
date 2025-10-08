import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return '/';
    return '/';
  };

  const closeMenu = () => setMenuOpen(false);

  // Helper to check if a link is active
  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get text classes based on active state
  const getTextClasses = (path, exact = false) => {
    const baseClasses = "font-medium transition-all duration-200 relative";
    const activeClasses = "text-gray-900 font-semibold";
    const inactiveClasses = "text-gray-600 hover:text-gray-900";
    
    const isActive = isActiveLink(path, exact);
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // helper for mobile logout: close menu then logout
  const handleMobileLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Mobile hamburger, Brand + Desktop Links */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle now on the LEFT */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            to={getDashboardLink()}
            className="text-xl font-bold text-blue-600 hover:text-blue-700"
            onClick={closeMenu}
          >
            Exam Portal
          </Link>

          {/* Desktop links */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={getTextClasses('/', true)}
              >
                Dashboard
                {isActiveLink('/', true) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform translate-y-3"></span>
                )}
              </Link>

              {user.role === 'student' && (
                <Link
                  to="/attempts/past"
                  className={getTextClasses('/attempts')}
                >
                  Past Attempts
                  {isActiveLink('/attempts') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform translate-y-3"></span>
                  )}
                </Link>
              )}

              {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                  <Link
                    to="/teacher/manage-tests"
                    className={getTextClasses('/teacher/manage-tests')}
                  >
                    Manage Tests
                    {isActiveLink('/teacher/manage-tests') && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform translate-y-3"></span>
                    )}
                  </Link>
                  <Link
                    to="/teacher/create-user"
                    className={getTextClasses('/teacher/create-user')}
                  >
                    Create User
                    {isActiveLink('/teacher/create-user') && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform translate-y-3"></span>
                    )}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Profile (desktop & mobile) */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Profile dropdown */}
              <ProfileDropdown user={user} />
            </div>
          ) : (
            <div className="hidden md:block">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (push-down) */}
      <div className={`md:hidden mt-2 px-4 ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3">
          {/* If user is logged in, show their links */}
          {user ? (
            <>
              <Link
                to="/"
                onClick={closeMenu}
                className={`block py-2 pl-3 relative ${getTextClasses('/', true)}`}
              >
                Dashboard
                {isActiveLink('/', true) && (
                  <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 transform -translate-y-1/2"></span>
                )}
              </Link>

              {user.role === 'student' && (
                <Link
                  to="/attempts/past"
                  onClick={closeMenu}
                  className={`block py-2 pl-3 relative ${getTextClasses('/attempts')}`}
                >
                  Past Attempts
                  {isActiveLink('/attempts') && (
                    <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 transform -translate-y-1/2"></span>
                  )}
                </Link>
              )}

              {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                  <Link
                    to="/teacher/manage-tests"
                    onClick={closeMenu}
                    className={`block py-2 pl-3 relative ${getTextClasses('/teacher/manage-tests')}`}
                  >
                    Manage Tests
                    {isActiveLink('/teacher/manage-tests') && (
                      <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 transform -translate-y-1/2"></span>
                    )}
                  </Link>
                  <Link
                    to="/teacher/create-user"
                    onClick={closeMenu}
                    className={`block py-2 pl-3 relative ${getTextClasses('/teacher/create-user')}`}
                  >
                    Create User
                    {isActiveLink('/teacher/create-user') && (
                      <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 transform -translate-y-1/2"></span>
                    )}
                  </Link>
                </>
              )}
            </>
          ) : (
            /* If not logged in, show Login inside the mobile menu */
            <Link
              to="/login"
              onClick={closeMenu}
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;