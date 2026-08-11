import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import RoleButton from "../components/RoleButton";

function AdminDashboard() {
  const {
    user,
  } = useContext(AuthContext);

  const showMessage = (
    action
  ) => {
    alert(
      `${action} action performed successfully.`
    );
  };

  return (
    <div className="page-container">

      <h1>
        Admin Dashboard
      </h1>

      <div className="information-card">

        <h2>
          Administrator Access
        </h2>

        <p>
          You are logged in as an
          administrator.
        </p>

        <p>
          Admin has complete access
          to create, edit, delete,
          and manage users.
        </p>

        <div className="button-group">

          <RoleButton
            userRole={user.role}
            allowedRoles={[
              "admin",
            ]}
            onClick={() =>
              showMessage(
                "Create User"
              )
            }
          >
            Create User
          </RoleButton>

          <RoleButton
            userRole={user.role}
            allowedRoles={[
              "admin",
            ]}
            onClick={() =>
              showMessage(
                "Edit User"
              )
            }
          >
            Edit User
          </RoleButton>

          <RoleButton
            userRole={user.role}
            allowedRoles={[
              "admin",
            ]}
            onClick={() =>
              showMessage(
                "Delete User"
              )
            }
          >
            Delete User
          </RoleButton>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;