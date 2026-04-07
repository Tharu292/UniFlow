import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';

// Public Pages
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import StudentNotifications from "./pages/StudentNotifications";
import StudentResources from './pages/StudentResources';

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import NotificationManagement from "./pages/AdminDashboard/NotificationManagement";
import UserManagement from "./pages/AdminDashboard/UserManagement";
import ResourceManagement from "./pages/AdminDashboard/ResourceManagement";

// Cloned Repo Pages (Optional)
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";

// --------------------
// Protected Route
// --------------------
const ProtectedRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// --------------------
// App Component
// --------------------
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Toaster position="top-right" reverseOrder={false} />
          <Header />

          <Routes>
            {/* -------------------- Public Routes -------------------- */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* -------------------- Student Protected Routes -------------------- */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route
              path="/student/notifications"
              element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>}
            />
            <Route
              path="/student/resources"
              element={<ProtectedRoute><StudentResources /></ProtectedRoute>}
            />

            {/* -------------------- Admin Protected Routes -------------------- */}
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/notifications"
              element={<ProtectedRoute><NotificationManagement /></ProtectedRoute>}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute><UserManagement /></ProtectedRoute>}
            />
            <Route
              path="/admin/resources"
              element={<ProtectedRoute><ResourceManagement /></ProtectedRoute>}
            />

            {/* -------------------- Cloned Repo Routes -------------------- */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/resources"
              element={<ProtectedRoute><Resources /></ProtectedRoute>}
            />

            {/* -------------------- Fallback -------------------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;