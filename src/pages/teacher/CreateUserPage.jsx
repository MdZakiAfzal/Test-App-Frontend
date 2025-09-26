// src/pages/teacher/CreateUserPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';

function CreateUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role is 'student'
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
      return setError('Passwords do not match.');
    }

    try {
      await apiClient.post('/auth/create-user', formData);
      setSuccess(`Successfully created user: ${formData.name}`);
      // Optionally, clear the form
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <p>Create an account for a new student or teacher.</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }}/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }}/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%' }}/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%' }}/>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%' }}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default CreateUserPage;