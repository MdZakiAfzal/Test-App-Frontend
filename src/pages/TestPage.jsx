import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. State for managing the student's answers
  // We use an object where the key is the question index (e.g., 0, 1, 2)
  // and the value is the selected option index.
  const [studentAnswers, setStudentAnswers] = useState({});

  // 2. This effect now fetches the test AND starts the attempt
  useEffect(() => {
    const initializeTest = async () => {
      try {
        // First, tell the backend we are starting the test
        await apiClient.post(`/attempts/${testId}/start`);
        
        // Then, fetch the test details (questions, title, etc.)
        const response = await apiClient.get(`/tests/${testId}`);
        setTest(response.data.data.test);
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to start the test. You may have already started it.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initializeTest();
  }, [testId]);

  // 3. Function to handle when a student selects an answer
  const handleAnswerChange = (questionIndex, optionIndex) => {
    setStudentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  };

  // 4. Function to handle the final submission of the test
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert our answers object into the array format the backend expects
    const formattedAnswers = Object.entries(studentAnswers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId, 10),
      selectedOption,
    }));

    try {
      // Send the answers to the backend's submit endpoint
      await apiClient.post(`/attempts/${testId}/submit`, { answers: formattedAnswers });
      
      // On success, show an alert and redirect to the dashboard
      alert('Test submitted successfully!');
      navigate('/'); // Navigate back to the dashboard

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit the test.';
      setError(errorMessage);
    }
  };

  if (loading) return <p>Preparing your test...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!test) return <p>Test not found.</p>;

  return (
    <div>
      <h2>{test.title}</h2>
      <p>{test.description}</p>
      <hr />

      {/* 5. The Form for displaying questions and submitting */}
      <form onSubmit={handleSubmit}>
        {test.questions.map((q, questionIndex) => (
          <div key={questionIndex} style={{ marginBottom: '1.5rem' }}>
            <h4>{`Q${questionIndex + 1}: ${q.questionText}`}</h4>
            <div>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      // Check the radio button if it's the one the user has selected
                      checked={studentAnswers[questionIndex] === optionIndex}
                      onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit">Submit Test</button>
      </form>
    </div>
  );
}

export default TestPage;