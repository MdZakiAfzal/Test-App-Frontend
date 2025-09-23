// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import PastAttemptsPage from './pages/PastAttemptsPage'; // <-- Import the new page

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/attempts/past" element={<PastAttemptsPage />} /> {/* <-- Add this route */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;