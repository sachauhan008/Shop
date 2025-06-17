import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = JSON.parse(atob(token.split(".")[1]));
        return { id: user.id, role: user.role };
      } catch (err) {
        return null;
      }
    }
    return null;
  });

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/" />}
          />

           <Route
            path="*"
            element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/" />}
          />

          <Route
            path="/register"
            element={!auth ? <Register /> : <Navigate to="/" />}
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute auth={auth}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute auth={auth}>
                <ProductList setAuth={setAuth} />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
