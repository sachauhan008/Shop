import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = ({ setAuth }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

    await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    fetchProducts();
    toast.success("Delete item successful", { position: "top-center" });
  };

  const handleEdit = (product) => {
    navigate("/add", { state: product });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    toast.success("Logged out successfully", { position: "top-center" });
    navigate("/login");
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || p.category === filter)
  );

  return (
    <div className="container mt-4">
       <div className="row align-items-center mb-4 g-2 text-center text-md-start">
        <div className="col-12 col-md-6">
          <h2 className="fw-bold">🍎 Fruit & Vegetable Market</h2>
        </div>

        <div className="col-6 col-md-3 text-end">
          <Link
            to="/add"
            className="btn btn-success w-100 w-md-auto px-4 py-2 rounded-pill shadow-sm"
          >
            + Add Product
          </Link>
        </div>

        <div className="col-6 col-md-3 text-end">
          <button
            className="btn btn-outline-danger w-100 w-md-auto px-4 py-2 rounded-pill shadow-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {filtered.length ? (
            filtered.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top rounded-top-4"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted small mb-2">
                      <strong>Category:</strong> {product.category}
                      <br />
                      <strong>Price:</strong> ₹{product.price} / kg
                      <br />
                      <strong>Quantity:</strong> {product.quantity} kg
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-primary px-3"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger px-3"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
