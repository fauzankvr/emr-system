import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaPills,
  FaStethoscope,
  FaSignOutAlt,
  FaFileAlt,
  FaSync,
  FaFileMedicalAlt,
} from "react-icons/fa";
import NavLink from "./NavLink";
import { axiosInstance } from "../../../API/axiosInstance";
import doctorImg from "../../../assets/doctor_img.jpg";
function Sidebar() {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. Mansoor Ali.Vp",
    phone: "+91 9895353078",
  });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        // const response = await axiosInstance.get("/api/doctor/profile");
        // setDoctorInfo(response.data);
      } catch (error) {
        console.error("Error fetching doctor info", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosInstance.post("/api/doctor/logout", {
          refreshToken: refreshToken
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("doctorData");
      window.location.href = "/doctor/login";
    }
  };

  return (
    <aside className="w-20 md:w-72 bg-blue-900 h-screen text-white flex flex-col py-6 px-2 md:px-4 transition-all duration-300">
      {/* Logo and Doctor Info */}
      <div className="flex flex-col items-center mb-10">
        <button
          className="text-xl cursor-pointer absolute top-5 left-5 "
          onClick={() => window.location.reload()} // Refresh page on click
        >
          <FaSync />
        </button>
        <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-md">
          <img
            className="w-full h-full object-cover rounded-full border-2 border-white"
            src={doctorImg}
            alt="Doctor"
          />
        </div>

        <h2 className="mt-4 text-base md:text-lg font-semibold hidden md:block">
          {doctorInfo.name}
        </h2>
        <p className="text-xs md:text-sm text-gray-300 hidden md:block">
          {doctorInfo.phone}
        </p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-6 md:space-y-4 text-sm font-medium">
        <NavLink
          to="/doctor/dashboard"
          icon={<FaUsers className="text-xl md:text-lg" />}
          label="Dashboard"
        />
        <NavLink
          to="/doctor/appointment"
          icon={<FaCalendarAlt className="text-xl md:text-lg" />}
          label="Book Appointment"
        />
        <NavLink
          to="/doctor/medicines"
          icon={<FaPills className="text-xl md:text-lg" />}
          label="Medicines"
        />
        <NavLink
          to="/doctor/patient-history"
          icon={<FaStethoscope className="text-xl md:text-lg" />}
          label="Patients History"
        />
        <NavLink
          to="/doctor/templates"
          icon={<FaFileAlt className="text-xl md:text-lg" />}
          label="Templates"
        />
        <NavLink
          to="/doctor/patients"
          icon={<FaUsers className="text-xl md:text-lg" />}
          label="Patient List"
        />

        <NavLink
          to="/doctor/investigations"
          icon={<FaFileMedicalAlt className="text-xl md:text-lg" />}
          label="Investigations"
        />

        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 w-full text-left"
        >
          <span className="text-xl md:text-lg">
            <FaSignOutAlt />
          </span>
          <span className="hidden md:block">Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
