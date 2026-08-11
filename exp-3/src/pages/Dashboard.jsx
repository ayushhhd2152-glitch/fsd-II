import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import api from "../services/api";

function Dashboard() {
  const {
    user,
    token,
  } = useContext(AuthContext);

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function getPosts() {
      try {
        const response =
          await api.get("/posts?_limit=3");

        setPosts(
          response.data
        );
      } catch (error) {
        setError(
          "Unable to load API data."
        );
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, []);

  return (
    <div className="page-container">

      <h1>
        User Dashboard
      </h1>

      <div className="information-card">

        <h2>
          Authentication Details
        </h2>

        <p>
          <strong>
            Username:
          </strong>
          {" "}
          {user.username}
        </p>

        <p>
          <strong>
            Role:
          </strong>
          {" "}
          {user.role}
        </p>

        <p>
          <strong>
            Authentication:
          </strong>
          {" "}
          Successful
        </p>

        <p>
          <strong>
            JWT Token:
          </strong>
        </p>

        <div className="token-box">
          {token}
        </div>

      </div>

      <div className="information-card">

        <h2>
          API Data
        </h2>

        <p>
          The Axios interceptor
          automatically attaches the JWT
          token to this request.
        </p>

        {loading && (
          <p>
            Loading posts...
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {posts.map(
          (post) => (
            <div
              className="post-card"
              key={post.id}
            >
              <h3>
                {post.title}
              </h3>

              <p>
                {post.body}
              </p>
            </div>
          )
        )}

      </div>

    </div>
  );
}

export default Dashboard;