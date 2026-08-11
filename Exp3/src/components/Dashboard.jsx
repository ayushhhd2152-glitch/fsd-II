import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import PostForm from './PostForm';
import PostList from './PostList';

export default function Dashboard({ user, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.posts);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handlePostSaved = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <span className="role-badge">{user.role.toUpperCase()}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {(user.role === 'admin' || user.role === 'editor') && (
          <div className="action-buttons">
            <button
              className="create-btn"
              onClick={() => {
                setShowForm(!showForm);
                setEditingPost(null);
              }}
            >
              {showForm ? 'Cancel' : '+ New Post'}
            </button>
          </div>
        )}

        {showForm && (
          <PostForm
            token={token}
            editingPost={editingPost}
            onPostSaved={handlePostSaved}
            userRole={user.role}
          />
        )}

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : (
          <PostList
            posts={posts}
            userRole={user.role}
            userId={user.id}
            onEdit={(post) => {
              setEditingPost(post);
              setShowForm(true);
            }}
            onDelete={handleDeletePost}
            onPostUpdated={fetchPosts}
            token={token}
          />
        )}
      </div>
    </div>
  );
}
