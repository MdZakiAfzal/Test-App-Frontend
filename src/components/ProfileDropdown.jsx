// src/components/ProfileDropdown.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const dropdownContentStyle = {
    display: isOpen ? 'block' : 'none',
    position: 'absolute',
    right: 0,
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1,
    listStyle: 'none',
    padding: '0',
    margin: '10px 0 0 0',
    borderRadius: '5px'
  };

  const linkStyle = {
    color: 'black',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'block',
  };

  return (
    <div style={dropdownStyle}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
        Hi, {user.name}
      </button>
      <ul style={dropdownContentStyle}>
        <li>
          <Link to="/account" style={linkStyle} onClick={() => setIsOpen(false)}>My Account</Link>
        </li>
        <li>
          <Link to="/settings" style={linkStyle} onClick={() => setIsOpen(false)}>Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;