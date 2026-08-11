import {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

function Login() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("viewer");

  const [error, setError] =
    useState("");

  const {
    login,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      username.trim() === "" ||
      password.trim() === ""
    ) {
      setError(
        "Please enter username and password."
      );

      return;
    }

    login(
      username,
      password,
      role
    );

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>
          Secure Login
        </h1>

        <p>
          Experiment 3:
          Role-Based Authentication
        </p>

        <form
          onSubmit={handleSubmit}
        >
          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
          />

          <label>
            Select Role
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(
                event.target.value
              )
            }
          >
            <option value="admin">
              Admin
            </option>

            <option value="editor">
              Editor
            </option>

            <option value="viewer">
              Viewer
            </option>
          </select>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>
        </form>

        <div className="demo-information">
          <h3>
            Demo Roles
          </h3>

          <p>
            Admin:
            Full access
          </p>

          <p>
            Editor:
            Create and edit access
          </p>

          <p>
            Viewer:
            Read-only access
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;