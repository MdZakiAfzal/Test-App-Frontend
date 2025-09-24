import { useLocation, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';

function ResultsPage() {
  const location = useLocation();
  const results = location.state?.results;
  const [showAnswers, setShowAnswers] = useState(false);

  if (!results) {
    return <Navigate to="/" replace />;
  }

  // This component now correctly reads from the nested 'summary' object
  const getAnswerStyle = (question, optionIndex) => {
    const isCorrect = optionIndex === question.correctAnswer;
    const isStudentAnswer = optionIndex === question.studentAnswer;

    if (isCorrect) return { color: 'green', fontWeight: 'bold' };
    if (isStudentAnswer && !isCorrect) return { color: 'red' };
    return { color: 'black' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Test Results</h2>
        <Link to="/">
          <button>Back to Dashboard</button>
        </Link>
      </div>
      <hr />

      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>Summary</h3>
        {/* Correctly access the summary data */}
        <p><strong>Final Score:</strong> {results.summary.score} / {results.summary.totalMarks}</p>
        <p><strong>Total Questions:</strong> {results.summary.totalQuestions}</p>
        <p><strong>Questions Attempted:</strong> {results.summary.attemptedQuestions}</p>
        <p><strong>Correct Answers:</strong> {results.summary.correctAnswers}</p>
        <p><strong>Incorrect Answers:</strong> {results.summary.incorrectAnswers}</p>
        <p><strong>Unattempted:</strong> {results.summary.unattemptedQuestions}</p>
      </div>

      <button onClick={() => setShowAnswers(!showAnswers)}>
        {showAnswers ? 'Hide Answers' : 'Show Detailed Answers'}
      </button>

      {showAnswers && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Answer Key</h3>
          {results.questions.map((q, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <h4>{`Q${index + 1}: ${q.questionText}`}</h4>
              <ul>
                {q.options.map((option, optionIndex) => (
                  <li key={optionIndex} style={getAnswerStyle(q, optionIndex)}>
                    {option}
                    {optionIndex === q.studentAnswer && <span> (Your Answer)</span>}
                    {optionIndex === q.correctAnswer && q.studentAnswer !== q.correctAnswer &&
                      <span style={{ color: 'green' }}> (Correct Answer)</span>
                    }
                  </li>
                ))}
              </ul>
              {q.studentAnswer === null && <p style={{ color: 'orange' }}>You did not answer this question.</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;