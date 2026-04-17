// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import StudentNotifications from "./pages/StudentNotifications";
import StudentResources from './pages/StudentResources';
import Forum from "./pages/Forum";
import Leaderboard from "./pages/Leaderboard";
import QuestionDetail from "./pages/QuestionDetails";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import NotificationManagement from "./pages/AdminDashboard/NotificationManagement";
import UserManagement from "./pages/AdminDashboard/UserManagement";
import ResourceManagement from "./pages/AdminDashboard/ResourceManagement";

// Cloned Repo Pages
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";

// --------------------
// Improved Protected Route
// --------------------
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// --------------------
// Layout Component
// --------------------
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const hideHeaderFooter = ["/", "/login", "/register", "/verify-otp", "/verify-email", "/forgot-password", "/reset-password"];
  const shouldHide = hideHeaderFooter.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      
      {!shouldHide && <Header />}
      
      <main className={`flex-1 ${shouldHide ? "" : "pt-4"}`}>
        {children}
      </main>
      
      {!shouldHide && <Footer />}
    </div>
  );
};

// --------------------
// App Component
// --------------------
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Student Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>} />
            <Route path="/student/resources" element={<ProtectedRoute><StudentResources /></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/question/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><NotificationManagement /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/resources" element={<ProtectedRoute><ResourceManagement /></ProtectedRoute>} />

            {/* Fallback - Go to RoleSelection instead of forcing login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;