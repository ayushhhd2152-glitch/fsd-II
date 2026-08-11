import {
  useContext,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

function Navbar() {
  const {
    user,
    logout,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="logo">
        SecureAuth
      </div>

      <div className="nav-links">
        <Link to="/dashboard">
          Dashboard
        </Link>

        {user.role === "admin" && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        {(user.role === "admin" ||
          user.role === "editor") && (
          <Link to="/editor">
            Editor
          </Link>
        )}

        <Link to="/viewer">
          Viewer
        </Link>

        <span className="user-role">
          {user.username}
          {" | "}
          {user.role.toUpperCase()}
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;