import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/send-otp`, formData);
      toast.success("OTP sent to your email", { position: "top-center" });
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP", { position: "top-center" });
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      toast.success("Registration complete!", { position: "top-center" });
      navigate("/login");
    } catch (err) {
      toast.error("Invalid OTP", { position: "top-center" });
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        {step === 1 && (
          <>
            <h3 className="text-center mb-4">Register</h3>
            <input
              className="form-control mb-3"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <input
              className="form-control mb-3"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              className="form-control mb-3"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button className="btn btn-success w-100" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h4 className="text-center mb-4">Verify OTP</h4>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={verifyOtp}>
              Verify & Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
