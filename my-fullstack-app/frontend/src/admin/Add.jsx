import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddLead = () => {
  const { serverUrl } = useContext(AuthContext);
  const { userdata, getCurrentUser } = useContext(userDataContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    annual_income: "",
    loan_amount: "",
    credit_history: "Average",
    urgency: "3+ months",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refresh current user on component mount
    getCurrentUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log("Submitting lead:", formData);

    const res = await axios.post(`${serverUrl}/api/leads/create`, formData, {
      withCredentials: true,
    });

    console.log("API response:", res.data);

    // Show success toast
    toast.success(
      `Lead created successfully! Assigned to: ${res.data.recommended_salesperson || "N/A"}`
    );

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      annual_income: "",
      loan_amount: "",
      credit_history: "Average",
      urgency: "3+ months",
    });
  } catch (err) {
    console.error("Error creating lead:", err.response?.data || err.message);

    // Show error toast
    toast.error(`Error: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-xl mx-auto p-4 shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Lead</h2>
      {userdata && (
        <p className="text-sm mb-2">Logged in as: {userdata.name} ({userdata.role})</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Annual Income:</label>
          <input
            type="number"
            name="annual_income"
            value={formData.annual_income}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Loan Amount:</label>
          <input
            type="number"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Credit History:</label>
          <select
            name="credit_history"
            value={formData.credit_history}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Poor</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Urgency:</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Within 1 month</option>
            <option>1-3 months</option>
            <option>3+ months</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {loading ? "Submitting..." : "Add Lead"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold">{message}</p>
      )}
    </div>
  );
};

export default AddLead;
