import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/';
    return '/';
  };

  const closeMenu = () => setMenuOpen(false);

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
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>

              {user.role === 'student' && (
                <Link
                  to="/attempts/past"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Past Attempts
                </Link>
              )}

              {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                  <Link
                    to="/teacher/manage-tests"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Manage Tests
                  </Link>
                  <Link
                    to="/teacher/create-user"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Create User
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Profile (desktop & mobile) */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center">
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2">
          {/* If user is logged in, show their links */}
          {user ? (
            <>
              <Link
                to="/"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>

              {user.role === 'student' && (
                <Link
                  to="/attempts/past"
                  onClick={closeMenu}
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Past Attempts
                </Link>
              )}

              {(user.role === 'admin' || user.role === 'teacher') && (
                <>
                  <Link
                    to="/teacher/manage-tests"
                    onClick={closeMenu}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Manage Tests
                  </Link>
                  <Link
                    to="/teacher/create-user"
                    onClick={closeMenu}
                    className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Create User
                  </Link>
                </>
              )}
            </>
          ) : (
            /* If not logged in, show Login inside the mobile menu */
            <Link
              to="/login"
              onClick={closeMenu}
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
