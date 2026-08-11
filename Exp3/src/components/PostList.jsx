import React, { useState } from 'react';
import axios from 'axios';
import './PostList.css';

export default function PostList({
  posts,
  userRole,
  userId,
  onEdit,
  onDelete,
  onPostUpdated,
  token
}) {
  const [expandedPost, setExpandedPost] = useState(null);

  const handleStatusChange = async (post) => {
    try {
      const newStatus = post.status === 'draft' ? 'published' : 'draft';
      await axios.put(
        `/api/posts/${post.id}`,
        { ...post, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdated();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="post-list">
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. {userRole !== 'viewer' && "Create one to get started!"}</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-title-section">
                <h3>{post.title}</h3>
                <span className={`status-badge status-${post.status}`}>
                  {post.status}
                </span>
              </div>

              <div className="post-actions">
                {(userRole === 'admin' ||
                  (userRole === 'editor' && post.authorId === userId)) && (
                  <>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(post)}
                      title="Edit post"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn status-btn"
                      onClick={() => handleStatusChange(post)}
                      title={`Change to ${post.status === 'draft' ? 'published' : 'draft'}`}
                    >
                      {post.status === 'draft' ? '📤 Publish' : '📥 Draft'}
                    </button>
                  </>
                )}

                {userRole === 'admin' && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(post.id)}
                    title="Delete post"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>

            <div className="post-meta">
              <span className="author">By {post.authorName || 'Unknown'}</span>
              <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="post-content-preview">
              {expandedPost === post.id ? (
                <p>{post.content}</p>
              ) : (
                <p>{post.content.substring(0, 150)}...</p>
              )}
            </div>

            <button
              className="expand-btn"
              onClick={() =>
                setExpandedPost(expandedPost === post.id ? null : post.id)
              }
            >
              {expandedPost === post.id ? 'Show less' : 'Read more'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
