import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown'; 

function Navbar() {
  const { user } = useAuth();

  const navStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #dee2e6',
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
      default:
        return '/';
    }
  };
/*
  return (
    <nav style={navStyle}>
      <div style={linkContainerStyle}>
        <Link to={getDashboardLink()}>Exam Portal</Link>
      </div>
      <div style={linkContainerStyle}>
        {user ? (
          <>
            <span style={{ alignSelf: 'center' }}>
              {user.name} ({user.role})
            </span>
            <Link to={getDashboardLink()}>Dashboard</Link>
            {user.role === 'student' && <Link to="/attempts/past">Past Attempts</Link>}
            {(user.role === 'admin' || user.role === 'teacher') &&(
              <Link to="/teacher/create-user">Create User</Link>
            )}
            <Link to="/settings">Settings</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
*/

  return (
    <nav style={navStyle}>
      <div style={linkContainerStyle}>
        <Link to={getDashboardLink()}>Exam Portal</Link>
        {user && <Link to={getDashboardLink()}>Dashboard</Link>}
        {user && user.role === 'student' && <Link to="/attempts/past">Past Attempts</Link>}
        {user && (user.role === 'admin' || user.role === 'teacher') && <Link to="/teacher/create-user">Create User</Link>}
        {/* ------------------------------------- */}
      </div>
      <div style={linkContainerStyle}>
        {user ? (
          <ProfileDropdown user={user} />
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;