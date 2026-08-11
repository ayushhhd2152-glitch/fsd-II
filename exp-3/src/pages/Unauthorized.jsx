import {
  Link,
} from "react-router-dom";

function Unauthorized() {
  return (
    <div className="unauthorized-page">

      <div className="unauthorized-card">

        <h1>
          403
        </h1>

        <h2>
          Access Denied
        </h2>

        <p>
          You do not have permission
          to access this page.
        </p>

        <Link
          to="/dashboard"
          className="back-button"
        >
          Return to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default Unauthorized;