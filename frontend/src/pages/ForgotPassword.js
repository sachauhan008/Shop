// pages/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch {
      toast.error("User not found");
    }
  };

  return (
    <div className="container mt-5  d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Forgot Password</h3>
      <input
        type="email"
        placeholder="Enter your email"
        className="form-control mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-success" onClick={handleSendOTP}>
        Send OTP
      </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
