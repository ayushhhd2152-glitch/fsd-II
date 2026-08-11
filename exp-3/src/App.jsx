import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Authenticated Users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Editor Route */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <EditorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Viewer Route */}
        <Route
          path="/viewer"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "editor", "viewer"]}
            >
              <ViewerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Invalid URL */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;