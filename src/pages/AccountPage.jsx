import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>My Account</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <hr />
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        {(user.role === 'admin' || user.role === 'teacher') 
          ? <Link to="/teacher/dashboard"><button>Teacher Dashboard</button></Link>
          : <Link to="/"><button>Dashboard</button></Link>
        }
        {user.role === 'student' && <Link to="/attempts/past"><button>Past Attempts</button></Link>}
        {(user.role === 'admin' || user.role === 'teacher') && <Link to="/teacher/create-user"><button>Create User</button></Link>}
        <Link to="/settings"><button>Settings</button></Link>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white' }}>Logout</button>
      </div>
    </div>
  );
}

export default AccountPage;