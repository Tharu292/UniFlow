import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';

// Your Pages
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
//import StudentDashboard from "./pages/StudentDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Settings from "./pages/Settings";

// Cloned repo Pages
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";

// Protected Route for Auth
const ProtectedRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Toaster position="top-right" reverseOrder={false} />
          <Header />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Auth-protected routes */}
            {/*<Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />*/}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Cloned repo routes (Optional auth if needed) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;