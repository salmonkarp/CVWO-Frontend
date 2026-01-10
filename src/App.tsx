import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  const token = localStorage.getItem('token'); // JWT

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
