import React from "react";
import { Navigate } from "react-router";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login"></Navigate>;
}
