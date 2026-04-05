import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  role?: "admin" | "student";
}

export default function ProtectedRoute({ children, role }: Props) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
}