const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  return { token: refreshToken, expiresAt };
};

// Register endpoint
router.post('/register', (req, res) => {
  const { username, email, password, role = 'viewer' } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  // Validate role
  const validRoles = ['admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or viewer' });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Insert user into database
    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }

        const user = { id: this.lastID, username, email, role };
        const token = generateToken(user);
        const refreshTokenData = generateRefreshToken(user.id);

        // Save refresh token
        db.run(
          'INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, ?)',
          [user.id, refreshTokenData.token, refreshTokenData.expiresAt]
        );

        res.status(201).json({
          message: 'User registered successfully',
          user: { id: user.id, username: user.username, email: user.email, role: user.role },
          token,
          refreshToken: refreshTokenData.token
        });
      }
    );
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    bcrypt.compare(password, user.password, (err, isPasswordValid) => {
      if (err) {
        return res.status(500).json({ error: 'Error verifying password' });
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user);
      const refreshTokenData = generateRefreshToken(user.id);

      // Save refresh token
      db.run(
        'INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, ?)',
        [user.id, refreshTokenData.token, refreshTokenData.expiresAt]
      );

      res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
        refreshToken: refreshTokenData.token
      });
    });
  });
});

// Refresh token endpoint
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Get user from database
    db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const newToken = generateToken(user);
      res.json({ token: newToken });
    });
  });
});

// Logout endpoint
router.post('/logout', verifyToken, (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    db.run('DELETE FROM refresh_tokens WHERE token = ? AND userId = ?', [refreshToken, req.user.id]);
  }

  res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', verifyToken, (req, res) => {
  db.get('SELECT id, username, email, role, createdAt FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  });
});

module.exports = router;
