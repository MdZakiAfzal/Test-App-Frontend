// src/pages/PastAttemptsPage.jsx
import { useState, useEffect } from 'react';
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
          {pastAttempts.map((attempt) => (
            <div key={attempt.test._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h3>{attempt.test.title}</h3>
              <p><strong>Your Score:</strong> {attempt.score} / {attempt.test.questions.length}</p>
              <p><strong>Attempted On:</strong> {new Date(attempt.attemptedAt).toLocaleString()}</p>
              {/* We can add a "Review Answers" button here later */}
            </div>
          ))}
        </div>
      ) : (
        <p>You have not completed any tests yet.</p>
      )}
    </div>
  );
}

export default PastAttemptsPage;