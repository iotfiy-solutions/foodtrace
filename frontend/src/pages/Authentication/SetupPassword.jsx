// src/pages/auth/SetupPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import InputField from "../../components/Inputs/InputField";

const BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5050";

export default function SetupPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwd = (password || "").trim();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(pwd)) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 8 characters long, contain one uppercase letter, and one special character.",
      });
    }

    if (pwd !== confirm) {
      return Swal.fire({
        icon: "warning",
        title: "Mismatch",
        text: "Passwords do not match.",
      });
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/set-password/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Set",
          text: data.message || "Password set successfully. OTP sent to your email.",
        });
        navigate(`/verify-otp/${encodeURIComponent(token)}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to set password.",
        });
      }
    } catch (err) {
      console.error("Network error:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-0">
      <div className="grid md:grid-cols-2 rounded-4xl items-stretch max-w-7xl w-full bg-white shadow-lg overflow-hidden">
        {/* Left (Form) Section */}
        <div className="p-8 w-full">
          <form className="space-y-6 lg:p-24 p-0" onSubmit={handleSubmit}>
            <div className="mb-8 text-center md:text-left">
              <img src={'/logo.png'} alt="IoTify Logo" className="h-10 mx-auto md:mx-0 mb-4" />
              <h3 className="text-slate-900 text-2xl font-semibold">Set Your Password</h3>
              <p className="text-slate-500 text-sm mt-2">
                Create a secure password with at least one uppercase letter, one special character, and minimum 8 characters.
              </p>
            </div>

            {/* Password Input */}
            <InputField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="New Password"
              value={password}
              onchange={(e) => setPassword(e.target.value)}
              placeholder="Enter New Password"
              showToggle={true}
              toggle={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password Input */}
            <InputField
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              label="Confirm Password"
              value={confirm}
              onchange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm Password"
              showToggle={true}
              toggle={() => setShowConfirm(!showConfirm)}
            />

            <div className="!mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none`}
              >
                {loading ? "Saving..." : "Set Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Right (Images) Section */}
        <div style={{ backgroundColor: "#EAEAEA" }} className="h-full hidden md:flex flex-col items-center justify-between p-4">
          {/* Top Image */}
          <div className="w-full flex justify-end p-4">
            <img src={'/login-right-top-image.png'} className="h-16 w-auto object-contain" alt="Top Right Illustration" />
          </div>

          {/* Main Image */}
          <div className="flex-grow flex items-center justify-center p-4">
            <img src={'/login-image.png'} className="w-full h-auto object-contain" alt="Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
}
