import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To access our login function
import apiClient from '../api/axiosConfig'; // Our configured axios instance

function LoginPage() {
  // 1. STATE MANAGEMENT
  // We use the `useState` hook to keep track of what the user types
  // into the email and password fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To hold any error messages from the API

  // 2. HOOKS for NAVIGATION and AUTHENTICATION
  const navigate = useNavigate(); // A hook from React Router to programmatically navigate
  const { login } = useAuth(); // Get the login function from our AuthContext

  // 3. FORM SUBMISSION HANDLER
  // This function runs when the user submits the form.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default browser form submission (page refresh)
    setError(''); // Clear any previous errors

    try {
      // Make the API call to your backend's login endpoint
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // If the login is successful, the backend will send back user data and a token
      const { token } = response.data;
      const { user } = response.data.data;

      // Use the login function from our AuthContext to update the global state
      login(user, token);

      // Redirect the user to the dashboard page after successful login
      navigate('/');

    } catch (err) {
      // If the API call fails (e.g., wrong password), we set an error message
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  // 4. JSX for the FORM
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Display the error message if it exists */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;