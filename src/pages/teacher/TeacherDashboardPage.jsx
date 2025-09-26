import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { format } from 'date-fns';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

function TeacherDashboardPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW STATE FOR MODAL MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

  useEffect(() => {
    const fetchAllTests = async () => {
      try {
        // This endpoint is only accessible to teachers/admins
        const response = await apiClient.get('/tests/all');
        setTests(response.data.data.tests);
      } catch (err) {
        setError('Failed to fetch tests.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllTests();
  }, []);

  const openDeleteModal = (test) => {
    setTestToDelete(test);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTestToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!testToDelete) return;

    try {
      await apiClient.delete(`/tests/${testToDelete._id}`);
      setTests(prevTests => prevTests.filter(test => test._id !== testToDelete._id));
      alert('Test deleted successfully.');
    } catch (err) {
      alert('Failed to delete test. Please try again.');
    } finally {
      closeDeleteModal(); // Close the modal after the action
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Teacher Dashboard</h2>
        <Link to="/teacher/create-test">
          <button>+ Create New Test</button>
        </Link>
      </div>
      <p>Here you can manage all the tests you have created.</p>
      <hr />
      {tests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tests.map((test) => (
            <div key={test._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px' }}>
              <h4>{test.title}</h4>
              <p><strong>Starts at:</strong> {format(new Date(test.startTime), "E, MMM d 'at' h:mm a")}</p>
              <p><strong>Duration:</strong> {test.examDuration} minutes</p>
              <div>
                {/* These links will be implemented in the next steps */}
                <Link to={`/teacher/test/${test._id}/edit`}>
                  <button style={{ marginRight: '10px' }}>Edit</button>
                </Link>
                <Link to={`/teacher/test/${test._id}/results`}>
                  <button style={{ marginRight: '10px' }}>View Results</button>
                </Link>
                <button 
                  onClick={() => openDeleteModal(test)} // <-- This now opens the modal
                  style={{ backgroundColor: '#dc3545', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not created any tests yet.</p>
      )}
      {/* Render the modal only when there's a test selected for deletion */}
      {testToDelete && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onRequestClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          testTitle={testToDelete.title}
        />
      )}
    </div>
  );
}

export default TeacherDashboardPage;