import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostForm.css';

export default function PostForm({ token, editingPost, onPostSaved, userRole }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setStatus(editingPost.status);
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'put' : 'post';

      await axios({
        method,
        url,
        data: { title, content, status },
        headers: { Authorization: `Bearer ${token}` }
      });

      setTitle('');
      setContent('');
      setStatus('draft');
      onPostSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
            rows="8"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
