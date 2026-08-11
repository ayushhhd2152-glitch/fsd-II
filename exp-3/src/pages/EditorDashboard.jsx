import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import RoleButton from "../components/RoleButton";

function EditorDashboard() {
  const {
    user,
  } = useContext(AuthContext);

  const showMessage = (
    action
  ) => {
    alert(
      `${action} completed.`
    );
  };

  return (
    <div className="page-container">

      <h1>
        Editor Dashboard
      </h1>

      <div className="information-card">

        <h2>
          Content Management
        </h2>

        <p>
          Editors can create and
          modify content.
        </p>

        <div className="button-group">

          <RoleButton
            userRole={user.role}
            allowedRoles={[
              "admin",
              "editor",
            ]}
            onClick={() =>
              showMessage(
                "Create Post"
              )
            }
          >
            Create Post
          </RoleButton>

          <RoleButton
            userRole={user.role}
            allowedRoles={[
              "admin",
              "editor",
            ]}
            onClick={() =>
              showMessage(
                "Edit Post"
              )
            }
          >
            Edit Post
          </RoleButton>

          <RoleButton
            userRole={user.role}
            allowedRoles={[
              "admin",
            ]}
            onClick={() =>
              showMessage(
                "Delete Post"
              )
            }
          >
            Delete Post
          </RoleButton>

        </div>

        {user.role === "editor" && (
          <p className="permission-note">

            Delete button is hidden
            because editors do not
            have delete permission.

          </p>
        )}

      </div>

    </div>
  );
}

export default EditorDashboard;