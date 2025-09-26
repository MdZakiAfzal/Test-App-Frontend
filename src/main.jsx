// src/main.jsx
import React from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import App from './App';
import './index.css';

// Set the main app element for the modal
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Add this wrapper */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* And this closing tag */}
  </React.StrictMode>,
);