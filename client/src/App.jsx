import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorRoutes from "./Routes/DoctorRoute";
import Home from "./Pages/doctor/HomePage";
import "./App.css";
import "./index.css";
import React from "react";
import LabLoginPage from "./Pages/doctor/LabLoginPage";
import ProtectedLabRoutes from "./Routes/ProtectedLabRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={ <Home/>}/>
         <Route path="lab/login" element={<LabLoginPage/>} />
         <Route path="/labside/*" element={<ProtectedLabRoutes />} />
        <Route path="/doctor/*" element={<DoctorRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
