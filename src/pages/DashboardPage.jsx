import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';

function DashboardPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
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
  }, [user]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h2>Welcome, {user?.name || 'Student'}!</h2>
      <h3>Today's Available Tests</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!error && (
        tests.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tests.map((test) => (
              <li key={test._id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                <h4>{test.title}</h4>
                <p>{test.description}</p>
                {/* --- ADD THESE TWO LINES --- */}
                <p><strong>Starts at:</strong> {test.startTimeIST}</p>
                <p><strong>Duration:</strong> {test.examDuration} minutes</p>
                {/* ------------------------- */}
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