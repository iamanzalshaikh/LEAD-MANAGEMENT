import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const EditLead = () => {
  const { serverUrl } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
    priority: "Low",
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/leads/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch lead:", err);
        toast.error("Failed to fetch lead.");
      }
    };
    fetchLead();
  }, [id, serverUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${serverUrl}/api/leads/modify/${id}`, formData);
      toast.success("Lead updated successfully!");
      navigate(`/sales/leads/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update lead.");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Lead</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="company"
          value={formData.company || ""}
          onChange={handleChange}
          placeholder="Company"
          className="w-full p-2 border rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Update Lead
        </button>
      </form>
    </div>
  );
};

export default EditLead;
