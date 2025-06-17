import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setAuth(res.data.user);
      toast.success("Login successful!", { position: "top-center" });
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials", { position: "top-center" });
    }
  };

  return (
    <>
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
          <h3 className="text-center mb-4">Login</h3>
          <input
            className="form-control mb-3"
            type= "email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="form-control mb-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
      <div className=" d-flex justify-content-center align-items-center">
        <Link
          to="/forgot-password"
          className="btn btn-warning ms-2 px-4 py-2 rounded-pill shadow-sm"
        >
          Forgot Password
        </Link>

        <Link
          to="/register"
          className="btn btn-info px-4 py-2 rounded-pill shadow-sm"
        >
          Register
        </Link>
      </div>
    </>
  );
};

export default Login;
