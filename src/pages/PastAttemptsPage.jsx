import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function PastAttemptsPage() {
  const [pastAttempts, setPastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPastAttempts = async () => {
      try {
        const response = await apiClient.get('/attempts/past');
        setPastAttempts(response.data.data.pastTests);
      } catch (err) {
        setError('Failed to fetch past attempts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPastAttempts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Past Attempts</h2>
        <p className="text-gray-600 mt-2">Review your previous test performances</p>
      </div>

      {pastAttempts.length > 0 ? (
        <div className="space-y-6">
          {pastAttempts.map((attempt, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{attempt.testTitle}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(attempt.attemptedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 text-center">
                    <div className="text-sm font-medium text-gray-500 mb-1">Score</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {attempt.summary.score} / {attempt.summary.totalMarks}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-500">Total Questions</div>
                    <div className="text-lg font-semibold text-gray-900">{attempt.summary.totalQuestions}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-blue-600">Attempted</div>
                    <div className="text-lg font-semibold text-blue-700">{attempt.summary.attemptedQuestions}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-600">Correct</div>
                    <div className="text-lg font-semibold text-green-700">{attempt.summary.correctAnswers}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-red-600">Incorrect</div>
                    <div className="text-lg font-semibold text-red-700">{attempt.summary.incorrectAnswers}</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link 
                    to="/results" 
                    state={{ results: attempt }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                  >
                    Review Answers
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No past attempts yet</h3>
          <p className="text-gray-500 mb-6">You haven't completed any tests yet.</p>
          <Link 
            to="/"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Take a Test
          </Link>
        </div>
      )}
    </div>
  );
}

export default PastAttemptsPage;