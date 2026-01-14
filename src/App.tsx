import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import AddTopic from "./pages/AddTopic";
import Topic from "./pages/Topic";
import Account from "./pages/Account";
import AddPost from "./pages/AddPost";

const theme = createTheme({
  palette: {
    primary: {
      main: "#512da8",
    },
    secondary: {
      main: '#ec407a',
    },
  },
});

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const isLoggedIn = !!token;

  const handleLogin = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <ThemeProvider theme={theme}>
      <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/home"} replace />}
      />
      <Route path="/home" element={<Home />} />
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/dashboard" replace />
            : <Login onLoginSuccess={(token, username) => handleLogin(token, username)} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard username={username || ""} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/addtopic"
        element={
          isLoggedIn ? (
            <AddTopic username={username || ""} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/t/:topic"
        element={
          isLoggedIn ? (
            <Topic username={username || ""} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/t/:topic/create"
        element={
          isLoggedIn ? (
            <AddPost username={username || ""} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/account"
        element={
          isLoggedIn ? (
            <Account username={username || ""} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
    </ThemeProvider>
    
  );
};

export default App;
