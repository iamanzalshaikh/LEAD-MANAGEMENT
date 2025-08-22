import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { userDataContext } from "../context/userContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyLeads = () => {
  const { serverUrl } = useContext(AuthContext);
  const { userdata } = useContext(userDataContext);
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (userdata?._id) fetchLeads();
  }, [userdata]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/leads/getlead`);
      // Only fetch leads assigned to current user
      const myLeads = res.data.filter(
        (lead) => lead.assigned_to?._id === userdata._id
      );
      setLeads(myLeads);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load leads.");
      toast.error("Failed to load leads.");
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(`${serverUrl}/api/leads/modify/${leadId}`, {
        status: newStatus,
      });
      toast.success("Status updated!");
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`${serverUrl}/api/leads/remove/${leadId}`);
      toast.success("Lead deleted successfully!");
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lead.");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return <div className="text-center mt-10">Loading leads...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">{error}</div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Leads</h1>
      <p className="text-gray-600 mb-4">
        Manage and track all your assigned leads
      </p>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search leads..."
          className="p-2 border rounded w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full sm:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Lead</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Contact</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Financial</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Priority</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td className="px-4 py-2">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-gray-500 text-sm">{lead.company || ""}</div>
                </td>
                <td className="px-4 py-2">
                  <div>{lead.email}</div>
                  <div className="text-gray-500 text-sm">{lead.phone}</div>
                </td>
                <td className="px-4 py-2 text-sm">
                  <div>Income: ${lead.annual_income || "N/A"}</div>
                  <div>Loan: ${lead.loan_amount || "N/A"}</div>
                  <div>Credit: {lead.credit_history || "N/A"}</div>
                </td>
                <td className="px-4 py-2 text-sm">
                  {lead.score || "N/A"}{" "}
                  <div className="text-gray-500">{lead.urgency || ""}</div>
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    lead.priority === "High"
                      ? "text-red-500"
                      : lead.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {lead.priority || "Low"}
                </td>
                <td className="px-4 py-2">
                  <select
                    className="p-1 border rounded text-sm"
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead._id, e.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </td>
                <td className="px-4 py-2 flex justify-center gap-3 text-gray-600">
                  {/* Edit */}
                  <FaEdit
                    className="cursor-pointer hover:text-green-500"
                    title="Edit"
                    onClick={() => navigate(`/sales/leads/edit/${lead._id}`)}
                  />
                  {/* Delete */}
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    title="Delete"
                    onClick={() => handleDelete(lead._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeads;
