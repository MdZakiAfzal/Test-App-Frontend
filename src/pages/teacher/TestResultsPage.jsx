import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';

function TestResultsPage() {
  const { testId } = useParams();
  const [results, setResults] = useState([]);
  const [testTitle, setTestTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // This endpoint fetches all student results for a given test
        const response = await apiClient.get(`/tests/${testId}/results`);
        setResults(response.data.data.results);
        // We can get the test title from another API call or pass it via state
        // For simplicity, we'll just show a generic title for now.
      } catch (err) {
        setError('Failed to fetch test results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [testId]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Student Results</h2>
        <Link to="/teacher/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
      <p><strong>Total Students Appeared:</strong> {results.length}</p>
      <hr />
      {results.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Student Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Student Email</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.studentId} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{result.name}</td>
                <td style={{ padding: '8px' }}>{result.email}</td>
                <td style={{ padding: '8px' }}>{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students have attempted this test yet.</p>
      )}
    </div>
  );
}

export default TestResultsPage;