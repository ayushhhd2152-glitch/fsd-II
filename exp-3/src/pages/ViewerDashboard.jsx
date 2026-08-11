import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

function ViewerDashboard() {
  const {
    user,
  } = useContext(AuthContext);

  return (
    <div className="page-container">

      <h1>
        Viewer Dashboard
      </h1>

      <div className="information-card">

        <h2>
          Read-Only Access
        </h2>

        <p>
          Welcome,
          {" "}
          <strong>
            {user.username}
          </strong>
        </p>

        <p>
          Your role is:
          {" "}
          <strong>
            {user.role}
          </strong>
        </p>

        <p>
          Viewers can read content
          but cannot create, edit,
          or delete content.
        </p>

        <div className="post-card">

          <h3>
            Secure Web Application
          </h3>

          <p>
            This content is visible
            to Admin, Editor, and
            Viewer roles.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ViewerDashboard;