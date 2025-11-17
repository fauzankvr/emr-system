import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BookAppointment from "../Pages/doctor/BookAppoiment";
// import SupportPage from "../pages/SupportPage";
import DashboardLayout from "../Components/doctor/layout/DashboardLayout";
import DashboardPage from "../Pages/admin/dashboard";
import MedicinePage from "../Pages/doctor/MedicinePage";
import PatientHistoryPage from "../Pages/doctor/PatientHIstory";
import Prescription from "../Pages/doctor/prescription";
import TemplatesPage from "../Pages/doctor/Templates";
import PatientListPage from "../Pages/doctor/PatientList";
import InvestigationHistoryPage from "../Pages/doctor/InvestigationHistoryPage";
import LabReports from "../Pages/doctor/LabReports";
import ProceduresPage from "../Pages/doctor/Procedures";

function ProtectedRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/doctor/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="appointment" element={<BookAppointment />} />
        <Route path="medicines" element={<MedicinePage />} />
        <Route path="patient-history" element={<PatientHistoryPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="prescription" element={<Prescription />} />
        <Route path="labreport" element={<LabReports />} />
        <Route path="patients" element={<PatientListPage />} />
        <Route path="procedures" element={<ProceduresPage  />} />
        {/* <Route path="support" element={<SupportPage />} /> */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default ProtectedRoutes;
