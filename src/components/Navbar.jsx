import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown'; 

function Navbar() {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/';
    // Now all users go to "/" for the unified dashboard
    return '/';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link 
            to={getDashboardLink()} 
            className="text-xl font-bold text-blue-600 hover:text-blue-700"
          >
            Exam Portal
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {/* All users see Dashboard link pointing to "/" */}
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

        <div className="flex items-center space-x-4">
          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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