import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  return (
    <nav style={navStyle}>
      <div style={linkContainerStyle}>
        <Link to="/">Exam Portal</Link>
      </div>
      <div style={linkContainerStyle}>
        {user ? (
          <>
            <span style={{ alignSelf: 'center' }}>
              {user.name || 'User'} ({user.role || 'Role'})
            </span>
            <Link to="/">Dashboard</Link>
            <Link to="/attempts/past">Past Attempts</Link> {/* <-- Add this link */}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;