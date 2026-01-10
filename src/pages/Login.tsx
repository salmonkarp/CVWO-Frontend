import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await response.text();
    if (data.includes('token')) {
      localStorage.setItem('token', data);
      navigate('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 300, m: 'auto', mt: 10 }}>
      <TextField
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
