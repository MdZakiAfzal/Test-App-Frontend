// src/pages/teacher/CreateTestPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import apiClient from '../../api/axiosConfig';

function CreateTestPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // State for the main test details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examDuration, setExamDuration] = useState(60);
  const [startTime, setStartTime] = useState('');

  // State for the questions. It's an array of objects.
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  // --- Handler Functions for Dynamic Questions ---

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Step 1: Read the uploaded Excel file
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Step 2: Convert the Excel sheet to a CSV string in memory
        const csvString = XLSX.utils.sheet_to_csv(worksheet);

        // Step 3: Parse the CSV string using Papa Parse
        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Transform the parsed data into the format our form's state expects
            const formattedQuestions = results.data.map(row => {
              if (!row.questionText) return null;
              return {
                questionText: row.questionText,
                options: [row.option1, row.option2, row.option3, row.option4],
                // Accept a 1-based index (1-4) and convert it to 0-based
                correctAnswer: parseInt(row.correctAnswer, 10) - 1,
              };
            }).filter(Boolean); // Filter out any empty or invalid rows

            setQuestions(formattedQuestions);
            alert(`${formattedQuestions.length} questions loaded successfully!`);
          },
        });
      } catch (err) {
        setError('Failed to process Excel file. Please ensure it has the correct format and column headers.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handles changes to a specific question's text
  const handleQuestionTextChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  // Handles changes to a specific option
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // Handles changing the correct answer for a question
  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  // Adds a new, blank question to the end of the list
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  // Removes a question by its index
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const testData = {
      title,
      description,
      examDuration,
      startTime,
      questions,
    };

    try {
      await apiClient.post('/tests', testData);
      alert('Test created successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test.');
    }
  };

  return (
    <div>
      <h2>Create New Test</h2>
      
      <div style={{ border: '1px dashed #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h4>Quick Upload from Excel</h4>
        <p>You can upload an Excel file (`.xls`, `.xlsx`). The `correctAnswer` column should be a number from 1 to 4.</p>
        <input 
          type="file" 
          accept=".xls, .xlsx" 
          onChange={handleFileUpload} 
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Main Test Details */}
        <input type="text" placeholder="Test Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <textarea placeholder="Test Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <input type="number" placeholder="Duration (minutes)" value={examDuration} onChange={(e) => setExamDuration(e.target.value)} required style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <hr />

        {/* Dynamic Questions Section */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', borderRadius: '5px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h4>Question {qIndex + 1}</h4>
              <button type="button" onClick={() => removeQuestion(qIndex)}>Remove</button>
            </div>
            <input
              type="text"
              placeholder={`Question ${qIndex + 1} Text`}
              value={q.questionText}
              onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
              required
              style={{display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem'}}
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                <input
                  type="radio"
                  name={`correct-answer-${qIndex}`}
                  checked={q.correctAnswer === oIndex}
                  onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                  style={{marginRight: '0.5rem'}}
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                  style={{flex: 1, padding: '0.5rem'}}
                />
              </div>
            ))}
          </div>
        ))}
        
        <button type="button" onClick={addQuestion}>+ Add Another Question</button>
        <hr />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Test</button>
      </form>
    </div>
  );
}

export default CreateTestPage;