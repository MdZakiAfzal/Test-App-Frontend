import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { format } from 'date-fns';

function InstructionsPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}`);
        setTest(response.data.data.test);
      } catch (err) {
        setError('Failed to load test details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestDetails();
  }, [testId]);

  const handleStartTest = () => {
    navigate(`/test/${testId}`);
  };

  if (loading) return <p>Loading instructions...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!test) return <p>Test not found.</p>;

  return (
    <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px' }}>
      <h2>{test.title}</h2>
      <p>{test.description}</p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '5px',
        margin: '1rem 0'
      }}>
        <div><strong>Starts at:</strong> {format(new Date(test.startTime), "E, MMM d 'at' h:mm a")}</div>
        <div><strong>Duration:</strong> {test.examDuration} minutes</div>
        <div><strong>Questions:</strong> {test.questions.length}</div>
      </div>
      {/* --------------------------- */}
      
      <h3>Instructions</h3>
      <ul>
        <li>This test consists of <strong>{test.questions.length} multiple-choice questions</strong>.</li>
        <li>You will have <strong>{test.examDuration} minutes</strong>  to complete the test.</li>
        <li>Each correct answer will award you <strong>+4 marks</strong>.</li>
        <li>Each incorrect answer will result in a penalty of <strong>-1 mark</strong>.</li>
        <li>There is no penalty for unattempted questions.</li>
        <li>The timer will start as soon as you click the "Proceed to Test" button.</li>
        <li>The test will be submitted automatically when the time runs out.</li>
      </ul>
      <button onClick={handleStartTest} style={{ marginTop: '1rem' }}>
        Proceed to Test
      </button>
    </div>
  );
}

export default InstructionsPage;