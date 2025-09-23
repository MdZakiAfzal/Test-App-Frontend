import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';

function DashboardPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get the user object

  useEffect(() => {
    // Only fetch tests if the user is logged in
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTests = async () => {
      try {
        const response = await apiClient.get('/tests');
        setTests(response.data.data.tests);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch tests.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]); // Re-run the effect if the user object changes

  // Always show a loading message until the fetch is complete
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  // The main component return
  return (
    <div>
      {/* Greet the user only if the user object exists */}
      <h2>Welcome, {user?.name || 'Student'}!</h2>
      <h3>Today's Available Tests</h3>
      
      {/* Show an error message if the API call failed */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display tests or a "no tests" message only if there wasn't an error */}
      {!error && (
        tests.length > 0 ? (
          <ul>
            {tests.map((test) => (
              <li key={test._id}>
                <h4>{test.title}</h4>
                <p>{test.description}</p>
                <Link to={`/test/${test._id}`}>
                  <button>Start Test</button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tests available for you today.</p>
        )
      )}
    </div>
  );
}

export default DashboardPage;