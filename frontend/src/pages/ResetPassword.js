// pages/ResetPassword.js
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { state } = useLocation();
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email: state.email,
        otp,
        newPassword,
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Invalid OTP or expired");
    }
  };

  return (
    <div className="container mt-5  d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Reset Password</h3>
      <input
        type="text"
        placeholder="Enter OTP"
        className="form-control mb-3"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        className="form-control mb-3"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button className="btn btn-success" onClick={handleReset}>
        Reset Password
      </button>
      </div>
    </div>
  );
};

export default ResetPassword;
