// src/pages/UpdatePasswordPage.jsx
import { useState } from 'react';
import apiClient from '../api/axiosConfig';

function UpdatePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      await apiClient.patch('/auth/updateMyPassword', formData);
      setSuccess('Password updated successfully!');
      setFormData({ currentPassword: '', password: '', confirmPassword: '' }); // Clear form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Update Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default UpdatePasswordPage;