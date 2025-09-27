// src/pages/SettingsPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function SettingsPage() {
  const { logout } = useAuth(); // Get the logout function from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
      <h2>Settings</h2>
      <p>Manage your account settings and preferences.</p>
      <hr />
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <Link to="/update-password">
          <button>Update Password</button>
        </Link>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: '#dc3545', color: 'white' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;