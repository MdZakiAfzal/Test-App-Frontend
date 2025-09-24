// src/pages/ResultsPage.jsx
import { useLocation, Navigate, Link } from 'react-router-dom';

function ResultsPage() {
  // The useLocation hook from React Router lets us access state
  // that was passed during navigation.
  const location = useLocation();
  const results = location.state?.results;

  // If a user navigates here directly without results, redirect them.
  if (!results) {
    return <Navigate to="/" replace />;
  }

  // Helper function to apply styles for correct/incorrect answers
  const getAnswerStyle = (question, selectedOption) => {
    if (selectedOption === question.correctAnswer) {
      return { color: 'green', fontWeight: 'bold' };
    }
    if (selectedOption !== null) {
      return { color: 'red' };
    }
    return {};
  };

  return (
    <div>
      <h2>Test Results</h2>
      <h3>Your Score: {results.score} / {results.questions.length}</h3>
      <hr />
      {results.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h4>{`Q${index + 1}: ${q.questionText}`}</h4>
          <ul>
            {q.options.map((option, optionIndex) => (
              <li key={optionIndex} style={getAnswerStyle(q, optionIndex)}>
                {option}
                {optionIndex === q.studentAnswer && <span> (Your Answer)</span>}
                {optionIndex === q.correctAnswer && <span style={{ color: 'green' }}> (Correct Answer)</span>}
              </li>
            ))}
          </ul>
          {q.studentAnswer === null && <p style={{ color: 'orange' }}>You did not answer this question.</p>}
        </div>
      ))}
      <Link to="/">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default ResultsPage;