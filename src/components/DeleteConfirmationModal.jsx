import { useState } from 'react';
import Modal from 'react-modal';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm, testTitle }) {
  const [confirmationText, setConfirmationText] = useState('');

  const handleConfirm = () => {
    if (confirmationText === testTitle) {
      onConfirm();
    } else {
      alert('The text you entered does not match the test title.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Confirmation"
      style={{ 
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } 
      }}
    >
      <h2>Confirm Deletion</h2>
      <p>This action cannot be undone. To confirm, please type the full title of the test:</p>
      <p><strong>{testTitle}</strong></p>
      <input
        type="text"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <div>
        <button onClick={onRequestClose} style={{ marginRight: '10px' }}>Cancel</button>
        <button
          onClick={handleConfirm}
          disabled={confirmationText !== testTitle}
          style={{ backgroundColor: '#dc3545', color: 'white' }}
        >
          Delete Test
        </button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;