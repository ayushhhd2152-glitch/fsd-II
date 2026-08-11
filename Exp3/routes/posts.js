const express = require('express');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all posts (published or user's own drafts)
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  let query;
  let params;

  // Admin can see all posts, others can see published posts + their own drafts
  if (role === 'admin') {
    query = `
      SELECT p.*, u.username as authorName 
      FROM posts p
      JOIN users u ON p.authorId = u.id
      ORDER BY p.createdAt DESC
    `;
    params = [];
  } else {
    query = `
      SELECT p.*, u.username as authorName 
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.status = 'published' OR p.authorId = ?
      ORDER BY p.createdAt DESC
    `;
    params = [userId];
  }

  db.all(query, params, (err, posts) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ posts });
  });
});

// Get dashboard posts (user's own posts)
router.get('/dashboard', verifyToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT * FROM posts WHERE authorId = ? ORDER BY createdAt DESC`,
    [userId],
    (err, posts) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ posts });
    }
  );
});

// Get single post by ID
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(
    `SELECT p.*, u.username as authorName FROM posts p JOIN users u ON p.authorId = u.id WHERE p.id = ?`,
    [id],
    (err, post) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check access: published posts are visible to all, drafts only to author and admin
      if (post.status !== 'published' && post.authorId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ post });
    }
  );
});

// Create post (admin and editor only)
router.post('/', verifyToken, checkRole(['admin', 'editor']), (req, res) => {
  const { title, content, status = 'draft' } = req.body;
  const authorId = req.user.id;

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Validate status
  const validStatus = ['draft', 'published'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be draft or published' });
  }

  db.run(
    'INSERT INTO posts (title, content, authorId, status) VALUES (?, ?, ?, ?)',
    [title, content, authorId, status],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating post' });
      }

      res.status(201).json({
        message: 'Post created successfully',
        post: {
          id: this.lastID,
          title,
          content,
          authorId,
          status,
          createdAt: new Date().toISOString()
        }
      });
    }
  );
});

// Update post (editor can edit own, admin can edit all)
router.put('/:id', verifyToken, checkRole(['admin', 'editor']), (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Get post to check ownership
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check authorization: editor can only edit own posts, admin can edit any
    if (userRole === 'editor' && post.authorId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Validate status
    if (status && !['draft', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be draft or published' });
    }

    db.run(
      'UPDATE posts SET title = ?, content = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, status || post.status, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating post' });
        }

        res.json({
          message: 'Post updated successfully',
          post: {
            id: parseInt(id),
            title,
            content,
            status: status || post.status,
            authorId: post.authorId,
            updatedAt: new Date().toISOString()
          }
        });
      }
    );
  });
});

// Delete post (admin only)
router.delete('/:id', verifyToken, checkRole(['admin']), (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting post' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  });
});

module.exports = router;
