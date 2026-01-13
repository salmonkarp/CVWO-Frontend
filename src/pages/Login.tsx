import { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface LoginProps {
  onLoginSuccess: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsRequesting(true);
    setIsError(false);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const data = await response.text();

      if (response.ok && data.includes('token')) {
        localStorage.setItem('token', data);
        localStorage.setItem('username', username);
        onLoginSuccess(data, username);
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 300, m: 'auto', height: '100vh', justifyContent: 'center' }}>
      <Box sx={{ height: 20, mb: 2, ml: -1 }}>
        <IconButton onClick={() => navigate('/home')}>
          <ArrowBack />
        </IconButton>
      </Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Login to Qrator
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <TextField
          label="Username"
          value={username}
          onChange={e => {setUsername(e.target.value); setIsError(false);}}
          sx={{ mb: 2 }}
          required={true}
          error={isError}
          helperText={isError ? 'Login failed. Please try again.' : ''}
        />
        <Button variant="contained" type='submit' loading={isRequesting} fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
