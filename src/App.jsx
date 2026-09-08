import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/useAuth";

import SetupPage from "./pages/SetupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SystemPage from "./pages/SystemPage";
import UsersPage from "./pages/UsersPage";
import SubjectsPage from "./pages/SubjectsPage";
import ClassroomsPage from "./pages/ClassroomsPage";
import WorksheetsPage from "./pages/WorksheetsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AdminLayout from "./components/AdminLayout";

function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-center"><div className="loading-card">กำลังตรวจสอบบัญชี...</div></div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-center"><div className="loading-card">กำลังเปิดระบบ...</div></div>;
  }

  return <Navigate to={user ? "/admin" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="system" element={<SystemPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="classrooms" element={<ClassroomsPage />} />
        <Route path="worksheets" element={<WorksheetsPage />} />
        <Route path="assignments" element={<ComingSoonPage module="assignments" />} />
        <Route path="submissions" element={<ComingSoonPage module="submissions" />} />
        <Route path="grading" element={<ComingSoonPage module="grading" />} />
        <Route path="qr" element={<ComingSoonPage module="qr" />} />
        <Route path="reports" element={<ComingSoonPage module="reports" />} />
        <Route path="audit" element={<ComingSoonPage module="audit" />} />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
