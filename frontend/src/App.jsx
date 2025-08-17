import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FriendManagement from './pages/FriendManagement';
import FraudReport from './pages/FraudReport';
import FraudFeed from './pages/FraudFeed';
import DisputeFraud from './pages/DisputeFraud';



const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendManagement />
          </ProtectedRoute>
        }
      />
          <Route
      path="/report-fraud"
      element={
        <ProtectedRoute>
          <FraudReport />
        </ProtectedRoute>
      }
    />
    <Route
  path="/fraud-feed"
  element={
    <ProtectedRoute>
      <FraudFeed />
    </ProtectedRoute>
  }
/>
<Route
  path="/dispute-fraud"
  element={
    <ProtectedRoute>
      <DisputeFraud />
    </ProtectedRoute>
  }
/>



    </Routes>

  </Router>
);

export default App;
