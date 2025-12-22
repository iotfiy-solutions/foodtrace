import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../contexts/storecontexts";

export default function UserCreatedByAdminRoute() {
      const { isLoggedIn, user, loading } = useStore();

  // while verifying session, render nothing (or a spinner component)
  if (loading) return null; // or return <Spinner />;

//     if (!isLoggedIn || !user.createdBy === "admin") {
//     return <Navigate to="/" replace />;
//   }

if (!isLoggedIn || (user.createdBy !== "admin")) {
  return <Navigate to="/" replace />;
}


  if (user.role === "admin") {
    return <Navigate to="/admin/management/users" replace />;
  }

  return (
    <Outlet/>    
)
}



