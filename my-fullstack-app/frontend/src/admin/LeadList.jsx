import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { userDataContext } from "../context/userContext";
import { toast } from "react-toastify";
import Spinner from "../component/Spinner";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function LeadList() {
  const { serverUrl } = useContext(AuthContext);
  const { userdata } = useContext(userDataContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userdata) return; // wait until user data is available
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/leads/getlead`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [serverUrl, userdata]);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`${serverUrl}/api/leads/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      toast.success("Lead deleted successfully!");
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (err) {
      toast.error(err.message);
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

  if (loading) return <Spinner />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Leads</h1>
      <p className="text-gray-600 mb-4">Browse and manage all system leads</p>

      {/* Search + Filter */}
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Lead
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Contact
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Financial
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Score
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Priority
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead._id}>
                {/* Lead Info */}
                <td className="px-4 py-2">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-gray-500 text-sm">
                    {lead.company || ""}
                  </div>
                </td>

                {/* Contact */}
                <td className="px-4 py-2">
                  <div>{lead.email}</div>
                  <div className="text-gray-500 text-sm">{lead.phone}</div>
                </td>

                {/* Financial */}
                <td className="px-4 py-2 text-sm">
                  <div>Income: ${lead.annual_income || 0}</div>
                  <div>Loan: ${lead.loan_amount || 0}</div>
                  <div>Credit: {lead.credit_history || "N/A"}</div>
                </td>

                {/* Score */}
                <td className="px-4 py-2 text-sm">
                  {lead.score || "N/A"}{" "}
                  <div className="text-gray-500">{lead.urgency || ""}</div>
                </td>

                {/* Priority */}
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

                {/* Status */}
                <td className="px-4 py-2">{lead.status}</td>

                {/* Actions */}
                <td className="px-4 py-2 flex justify-center gap-3 text-gray-600">
                  <FaEye
                    className="cursor-pointer hover:text-blue-500"
                    title="View"
                    onClick={() => navigate(`/leaddetails/${lead._id}`)}
                  />
                  <FaEdit
                    className="cursor-pointer hover:text-green-500"
                    title="Edit"
                    onClick={() => navigate(`/leads/edit/${lead._id}`)}
                  />
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
}
