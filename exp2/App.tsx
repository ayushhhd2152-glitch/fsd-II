import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './app/store';
import { addPost, removePost, togglePin } from './features/posts/postsSlice';
import { setSelectedPlatform, syncPlatformStats } from './features/platform/platformSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const selectedPlatform = useSelector((state: RootState) => state.platform.selectedPlatform);
  const platforms = useSelector((state: RootState) => state.platform.platforms);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [platform, setPlatform] = useState('x');

  const visiblePosts = useMemo(() => {
    return posts.filter((post) => selectedPlatform === 'All' || post.platform === selectedPlatform);
  }, [posts, selectedPlatform]);

  const pinnedCount = posts.filter((post) => post.pinned).length;

  useEffect(() => {
    dispatch(syncPlatformStats());
  }, [dispatch, posts]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;

    dispatch(addPost({ title: title.trim(), body: body.trim(), platform }));
    dispatch(syncPlatformStats());
    setTitle('');
    setBody('');
    setPlatform('x');
  };

  const handleTogglePin = (postId: string) => {
    dispatch(togglePin(postId));
    dispatch(syncPlatformStats());
  };

  const handleRemove = (postId: string) => {
    dispatch(removePost(postId));
    dispatch(syncPlatformStats());
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Redux Toolkit state hub</p>
          <h1>Centralized post and platform workspace</h1>
          <p className="hero-copy">
            Manage post lifecycle, pinning, and platform-specific metrics from a single store.
          </p>
        </div>
        <div className="hero-badge">{posts.length} active posts</div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total posts</span>
          <strong>{posts.length}</strong>
        </article>
        <article className="stat-card">
          <span>Pinned posts</span>
          <strong>{pinnedCount}</strong>
        </article>
        <article className="stat-card">
          <span>Selected view</span>
          <strong>{selectedPlatform === 'All' ? 'All channels' : selectedPlatform}</strong>
        </article>
      </section>

      <section className="layout-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Create a post</h2>
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What is happening?" />
          </label>
          <label>
            Body
            <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share the latest update..." />
          </label>
          <label>
            Platform
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              {platforms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Publish post</button>
        </form>

        <div className="panel">
          <div className="panel-header">
            <h2>Platform view</h2>
            <select value={selectedPlatform} onChange={(event) => dispatch(setSelectedPlatform(event.target.value))}>
              <option value="All">All platforms</option>
              {platforms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="platform-list">
            {platforms.map((item) => (
              <div key={item.id} className="platform-item">
                <span className="dot" style={{ backgroundColor: item.accent }} />
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.count} posts</p>
                </div>
              </div>
            ))}
          </div>

          <div className="post-list">
            {visiblePosts.map((post) => (
              <article key={post.id} className={`post-card ${post.pinned ? 'pinned' : ''}`}>
                <div className="post-top">
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                  </div>
                  <span className="post-platform">{post.platform}</span>
                </div>
                <div className="post-actions">
                  <button type="button" onClick={() => handleTogglePin(post.id)}>
                    {post.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button type="button" className="danger" onClick={() => handleRemove(post.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
