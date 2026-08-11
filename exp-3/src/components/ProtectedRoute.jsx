import { useContext } from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
  } = useContext(AuthContext);

  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-page">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;