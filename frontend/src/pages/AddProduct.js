import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const location = useLocation();
  const product = location.state || null;

  const [form, setForm] = useState({
    name: "",
    category: "Fruit",
    price: "",
    quantity: "",
    image: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
      });
    }
  }, [product]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");

    e.preventDefault();
    if (product) {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/products/${product._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Update item successful", { position: "top-center" });
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/products`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      toast.success("Add item successful", { position: "top-center" });
    }
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="p-4 border rounded-4 shadow-sm bg-light">
        <h2 className="mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                name="image"
                className="form-control"
                value={form.image}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 text-end mt-3">
              <button type="submit" className="btn btn-primary px-4">
                {product ? "Update" : "Add"} Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
