import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import PastAttemptsPage from './pages/PastAttemptsPage'; 
import ResultsPage from './pages/ResultsPage';
import InstructionsPage from './pages/InstructionsPage';
import RoleBasedRoute from './components/RoleBasedRoute'; 
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import CreateTestPage from './pages/teacher/CreateTestPage';
import TestResultsPage from './pages/teacher/TestResultsPage';
import EditTestPage from './pages/teacher/EditTestPage';
import CreateUserPage from './pages/teacher/CreateUserPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- Protected STUDENT Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/instructions/:testId" element={<InstructionsPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/attempts/past" element={<PastAttemptsPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>
        
        {/* --- Protected TEACHER/ADMIN Routes --- */}
        <Route element={<RoleBasedRoute allowedRoles={['admin', 'teacher']} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/create-user" element={<CreateUserPage />} /> 
          <Route path="/teacher/create-test" element={<CreateTestPage />} />
          <Route path="/teacher/test/:testId/results" element={<TestResultsPage />} />
          <Route path="/teacher/test/:testId/edit" element={<EditTestPage />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;