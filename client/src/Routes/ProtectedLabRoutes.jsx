import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LabDashboardPage from "../Pages/lab/dashboard"; // Your lab dashboard
// Import other lab pages as needed...

function ProtectedLabRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const labAccessToken = localStorage.getItem("labAccessToken");
    const labRefreshToken = localStorage.getItem("labRefreshToken");

    if (labAccessToken && labRefreshToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-700">Loading Lab Dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/lab/login" replace />;
  }

  return (
      <Routes>
        <Route path="dashboard" element={<LabDashboardPage />} />
        {/* <Route path="tests" element={<LabTestsPage />} />
        <Route path="reports" element={<LabReportsPage />} />
        <Route path="patients" element={<LabPatientsPage />} /> */}
        {/* Add more lab-specific routes here */}
        
        {/* Catch-all: redirect to lab dashboard */}
        {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
      </Routes>
  );
}

export default ProtectedLabRoutes;