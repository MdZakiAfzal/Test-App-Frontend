import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function PastAttemptsPage() {
  const [pastAttempts, setPastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPastAttempts = async () => {
      try {
        const response = await apiClient.get('/attempts/past');
        setPastAttempts(response.data.data.pastTests);
      } catch (err) {
        setError('Failed to fetch past attempts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPastAttempts();
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Past Attempts</h2>
      {pastAttempts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pastAttempts.map((attempt, index) => {
            return (
              <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h3>{attempt.testTitle}</h3>
                {/* Display the score from the summary object */}
                <p><strong>Your Score:</strong> {attempt.summary.score} / {attempt.summary.totalMarks}</p>
                <p><strong>Attempted On:</strong> {new Date(attempt.attemptedAt).toLocaleString()}</p>
                
                {/* The 'attempt' object from the backend already has the perfect structure,
                  including the summary, so we pass it directly.
                */}
                <Link to="/results" state={{ results: attempt }}>
                  <button>Review Answers</button>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p>You have not completed any tests yet.</p>
      )}
    </div>
  );
}

export default PastAttemptsPage;