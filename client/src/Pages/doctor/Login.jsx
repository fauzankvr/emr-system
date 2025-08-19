import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "../../API/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/doctor/login", {
        email,
        password,
      });
      console.log("response...")
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("doctorData", JSON.stringify(response.data.doctor)); // Stringify doctorData

      toast.success("Login successful!", {
        position: "top-center",
      });

      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/"); // Go back to the previous page
    // Alternatively, you can navigate to a specific route, e.g., navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-700 to-cyan-400 px-4 relative">
      <ToastContainer />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-white hover:text-cyan-200 transition-colors"
        aria-label="Go back"
      >
        <FaArrowLeft size={24} />
      </button>

      {/* Login Box */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center space-y-5">
        <h2 className="text-3xl font-bold text-gray-800">Doctor Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? "bg-cyan-400 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
