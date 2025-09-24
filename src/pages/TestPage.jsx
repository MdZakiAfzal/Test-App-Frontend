import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Timer from '../components/Timer';
import QuestionPalette from '../components/QuestionPalette';

function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentAnswers, setStudentAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState(new Set());

  useEffect(() => {
    const initializeTest = async () => {
      try {
        const attemptResponse = await apiClient.post(`/attempts/${testId}/start`);
        setAttempt(attemptResponse.data.data);
        const testResponse = await apiClient.get(`/tests/${testId}`);
        setTest(testResponse.data.data.test);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to start the test.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    initializeTest();
  }, [testId]);

  const goToNextQuestion = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setVisitedQuestions(prev => new Set(prev).add(nextIndex));
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const jumpToQuestion = (index) => {
    if (test && index >= 0 && index < test.questions.length) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => new Set(prev).add(index));
    }
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setStudentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  };

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
        if (err.code !== "ERR_CANCELED") {
            const errorMessage = err.response?.data?.message || 'Failed to submit the test.';
            setError(errorMessage);
        }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTest();
  };
  
  if (loading) return <p>Preparing your test...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!test || !attempt) return <p>Test data is not available.</p>;

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    // This outer div uses flexbox to structure the entire page vertically
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}> {/* Adjust height based on Navbar */}
      <header style={{ padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{test.title}</h2>
          <Timer 
            durationInMinutes={test.examDuration} 
            startTime={attempt.startedAt} 
            onTimeUp={submitTest} 
          />
        </div>
        <hr />
      </header>
      
      {/* This main content area grows to fill all available vertical space */}
      <main style={{ flex: 1, display: 'flex', gap: '20px', padding: '1rem', overflowY: 'auto' }}>
        {/* Left Column: Question Palette */}
        <div style={{ flex: '0 0 250px' }}>
          <QuestionPalette 
            questions={test.questions}
            currentQuestionIndex={currentQuestionIndex}
            studentAnswers={studentAnswers}
            visitedQuestions={visitedQuestions}
            markedForReview={markedForReview}
            onQuestionSelect={jumpToQuestion}
          />
        </div>

        {/* Right Column: Question and Navigation */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          {/* This question area will grow, pushing the footer down */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
            <h4>{`Q${currentQuestionIndex + 1}: ${currentQuestion.questionText}`}</h4>
            <div>
              {currentQuestion.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={optionIndex}
                      checked={studentAnswers[currentQuestionIndex] === optionIndex}
                      onChange={() => handleAnswerChange(currentQuestionIndex, optionIndex)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons are now in a non-scrolling footer section */}
          <footer style={{ paddingTop: '1rem', borderTop: '1px solid #eee', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              <button onClick={toggleMarkForReview}>
                {markedForReview.has(currentQuestionIndex) ? 'Unmark Review' : 'Mark for Review'}
              </button>
              {currentQuestionIndex === test.questions.length - 1 ? (
                <button onClick={handleSubmit}>Submit Test</button>
              ) : (
                <button onClick={goToNextQuestion}>Next</button>
              )}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default TestPage;