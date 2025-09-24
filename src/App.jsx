import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import PastAttemptsPage from './pages/PastAttemptsPage'; 
import ResultsPage from './pages/ResultsPage';
import InstructionsPage from './pages/InstructionsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/instructions/:testId" element={<InstructionsPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/attempts/past" element={<PastAttemptsPage />} /> 
          <Route path="/results" element={<ResultsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;