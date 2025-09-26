import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { format } from 'date-fns';
import apiClient from '../../api/axiosConfig';

function EditTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // State for all form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examDuration, setExamDuration] = useState(60);
  const [startTime, setStartTime] = useState('');
  const [questions, setQuestions] = useState([]);

  // Fetch existing test data when the page loads
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}`);
        const test = response.data.data.test;
        
        // Pre-fill the form state with data from the backend
        setTitle(test.title);
        setDescription(test.description);
        setExamDuration(test.examDuration);
        setStartTime(format(new Date(test.startTime), "yyyy-MM-dd'T'HH:mm"));
        setQuestions(test.questions);
      } catch (err) {
        setError('Failed to load test data for editing.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [testId]);

  // Handler for file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csvString = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedQuestions = results.data.map(row => {
              if (!row.questionText) return null;
              return {
                questionText: row.questionText,
                options: [row.option1, row.option2, row.option3, row.option4],
                correctAnswer: parseInt(row.correctAnswer, 10) - 1,
              };
            }).filter(Boolean);
            setQuestions(formattedQuestions);
            alert(`${formattedQuestions.length} questions loaded successfully!`);
          },
        });
      } catch (err) {
        setError('Failed to process Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handlers for manual form changes
  const handleQuestionTextChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };
  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  // Form submission handler to update the test
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Note: startTime is not sent, as the backend prevents updating it.
    const updatedTestData = {
      title,
      description,
      examDuration,
      questions,
    };

    try {
      await apiClient.patch(`/tests/${testId}`, updatedTestData);
      alert('Test updated successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update test.');
    }
  };

  if (loading) return <p>Loading test for editing...</p>;

  return (
    <div>
      <h2>Edit Test</h2>
      <div style={{ border: '1px dashed #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h4>Quick Upload to Replace Questions</h4>
        <p>You can upload an Excel file to replace the questions below.</p>
        <input 
          type="file" 
          accept=".xls, .xlsx" 
          onChange={handleFileUpload} 
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Test Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <textarea placeholder="Test Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <input type="number" placeholder="Duration (minutes)" value={examDuration} onChange={(e) => setExamDuration(e.target.value)} required style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}}/>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem'}} readOnly/>
        <hr />

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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditTestPage;