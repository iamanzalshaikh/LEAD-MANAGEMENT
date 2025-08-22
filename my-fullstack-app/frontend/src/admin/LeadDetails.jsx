import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "../component/Spinner";
import axios from "axios";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthContext);

  const [lead, setLead] = useState(null);
  const [salespeople, setSalespeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Lead fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [creditHistory, setCreditHistory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState(null);
  const [notes, setNotes] = useState("");

  // Fetch lead and salespeople
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lead details
        const leadRes = await axios.get(`${serverUrl}/api/leads/${id}`, { withCredentials: true });
        const leadData = leadRes.data;
        console.log("Lead data fetched:", leadData);

        setLead(leadData);
        setName(leadData.name || "");
        setEmail(leadData.email || "");
        setPhone(leadData.phone || "");
        setLoanAmount(leadData.loan_amount || "");
        setCreditHistory(leadData.credit_history || "");
        setUrgency(leadData.urgency || "");
        setPriority(leadData.priority || "Low");
        setStatus(leadData.status || "New");
        setAssignedTo(leadData.assigned_to?._id || "");
        setNotes(leadData.notes || "");

        // Salespeople
        const salesRes = await axios.get(`${serverUrl}/api/sales`, { withCredentials: true });
        console.log("Salespeople fetched:", salesRes.data);
        setSalespeople(salesRes.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, serverUrl]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedLead = {
        name,
        email,
        phone,
        loan_amount: loanAmount,
        credit_history: creditHistory,
        urgency,
        priority,
        status,
        assigned_to: assignedTo || null,
        notes,
      };

      console.log("Assigning lead to salesperson ID:", assignedTo);

      const { data } = await axios.put(
        `${serverUrl}/api/leads/modify/${id}`,
        updatedLead,
        { withCredentials: true }
      );

      console.log("Updated lead data:", data.lead);
      setLead(data.lead);
      setIsEditing(false);
      toast.success("Lead updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      setLoading(true);
      await axios.delete(`${serverUrl}/api/leads/remove/${id}`, { withCredentials: true });
      toast.success("Lead deleted successfully!");
      navigate("/leadlist");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!lead) return <div className="text-center py-8">Lead not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lead Details</h1>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="bg-white shadow p-4 rounded">
          <div>
            <label>Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border w-full p-2 mb-2" />
          </div>
          <div>
            <label>Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full p-2 mb-2" />
          </div>
          <div>
            <label>Phone:</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border w-full p-2 mb-2" />
          </div>
          <div>
            <label>Loan Amount:</label>
            <input value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="border w-full p-2 mb-2" />
          </div>
          <div>
            <label>Credit History:</label>
            <select value={creditHistory} onChange={(e) => setCreditHistory(e.target.value)} className="border w-full p-2 mb-2">
              <option value="">Select Credit History</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div>
            <label>Urgency:</label>
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="border w-full p-2 mb-2">
              <option value="">Select Urgency</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </div>
          <div>
            <label>Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border w-full p-2 mb-2">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border w-full p-2 mb-2">
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label>Assigned To:</label>
            <select value={assignedTo || ""} onChange={(e) => setAssignedTo(e.target.value || null)} className="border w-full p-2 mb-2">
              <option value="">Select Salesperson</option>
              {salespeople.map((sp) => (
                <option key={sp._id} value={sp._id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Notes:</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="border w-full p-2 mb-2" />
          </div>
          <div className="flex space-x-2">
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save</button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow p-4 rounded">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Phone:</strong> {lead.phone}</p>
          <p><strong>Loan Amount:</strong> {lead.loan_amount}</p>
          <p><strong>Credit History:</strong> {lead.credit_history}</p>
          <p><strong>Urgency:</strong> {lead.urgency}</p>
          <p><strong>Priority:</strong> {lead.priority}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Assigned To:</strong> {lead.assigned_to?.name || "Unassigned"}</p>
          <p><strong>Notes:</strong> {lead.notes}</p>

          <div className="mt-4 flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2">Edit</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetails;
