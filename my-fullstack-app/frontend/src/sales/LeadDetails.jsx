import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const LeadDetails = () => {
  const { serverUrl } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/leads/${id}`);
        setLead(res.data);
      } catch (err) {
        console.error("Failed to fetch lead:", err);
        toast.error("Failed to fetch lead.");
      }
    };
    fetchLead();
  }, [id, serverUrl]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${serverUrl}/api/leads/remove/${id}`);
      toast.success("Lead deleted successfully!");
      navigate("/sales/leads");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete lead.");
    }
  };

  if (!lead) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 bg-white shadow rounded max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{lead.name}</h2>
      <p><strong>Email:</strong> {lead.email}</p>
      <p><strong>Phone:</strong> {lead.phone}</p>
      <p><strong>Company:</strong> {lead.company}</p>
      <p><strong>Status:</strong> {lead.status}</p>
      <p><strong>Priority:</strong> {lead.priority}</p>

      <div className="flex gap-4 mt-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => navigate(`/sales/leads/edit/${lead._id}`)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default LeadDetails;
