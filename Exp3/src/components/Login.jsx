import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
        role
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onLoginSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onLoginSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isRegistering ? 'Create Account' : 'Login'}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required={isRegistering}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="viewer">Viewer (Can only view posts)</option>
                <option value="editor">Editor (Can create & edit posts)</option>
                <option value="admin">Admin (Full access)</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="toggle-auth">
          {isRegistering ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                  setUsername('');
                }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
