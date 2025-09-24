function QuestionPalette({
  questions,
  currentQuestionIndex,
  studentAnswers,
  visitedQuestions,
  markedForReview,
  onQuestionSelect,
}) {
  const getButtonStatusStyle = (index) => {
    const baseStyle = {
      width: '40px',
      height: '40px',
      margin: '5px',
      cursor: 'pointer',
      border: '1px solid #ccc',
      borderRadius: '4px',
    };

    if (index === currentQuestionIndex) {
        baseStyle.backgroundColor = '#007bff'; // 1. Current (Highest priority)
    } else if (markedForReview.has(index)) {
        baseStyle.backgroundColor = '#6f42c1'; // 2. Marked for Review
    } else if (studentAnswers.hasOwnProperty(index)) {
        baseStyle.backgroundColor = '#28a745'; // 3. Attempted
    } else if (visitedQuestions.has(index)) {
        baseStyle.backgroundColor = '#dc3545'; // 4. Visited but not attempted
    } else {
        baseStyle.backgroundColor = '#fff'; // 5. Not Visited
    }

    return baseStyle;
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
      <h4>Questions</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {questions.map((_, index) => (
          <button
            key={index}
            style={getButtonStatusStyle(index)}
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionPalette;