import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Timer from '../components/Timer';

function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentAnswers, setStudentAnswers] = useState({});

  useEffect(() => {
    const initializeTest = async () => {
      try {
        const attemptResponse = await apiClient.post(`/attempts/${testId}/start`);
        setAttempt(attemptResponse.data.data);
        
        const testResponse = await apiClient.get(`/tests/${testId}`);
        setTest(testResponse.data.data.test);
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to start the test. You may have already started it.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    initializeTest();
  }, [testId]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setStudentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  };

  // New reusable function for submitting the test
  const submitTest = async () => {
    const formattedAnswers = Object.entries(studentAnswers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId, 10),
      selectedOption,
    }));

    try {
      const response = await apiClient.post(`/attempts/${testId}/submit`, { answers: formattedAnswers });
      
      alert('Test submitted successfully!');
      navigate('/results', { state: { results: response.data.data } });

    } catch (err) {
      // To prevent showing an error if the user navigates away after auto-submission
      if (err.code !== "ERR_CANCELED") {
        const errorMessage = err.response?.data?.message || 'Failed to submit the test.';
        setError(errorMessage);
      }
    }
  };
  
  // The manual submit handler now just calls our reusable function
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitTest();
  };

  if (loading) return <p>Preparing your test...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!test || !attempt) return <p>Test data is not available.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{test.title}</h2>
        {/* Pass the submitTest function to the Timer as the onTimeUp prop */}
        <Timer 
          durationInMinutes={test.examDuration} 
          startTime={attempt.startedAt} 
          onTimeUp={submitTest} 
        />
      </div>
      <p>{test.description}</p>
      <hr />
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