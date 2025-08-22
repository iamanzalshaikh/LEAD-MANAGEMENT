// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { Toaster, toast } from "react-hot-toast";
// import Spinner from "../component/Spinner";
// import { AuthContext } from "../context/AuthContext";

// const ManageSalesmen = () => {
//   const { serverUrl } = useContext(AuthContext);
//   const [salespeople, setSalespeople] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showLeadsModal, setShowLeadsModal] = useState(false);
//   const [allLeads, setAllLeads] = useState([]);
//   const [personLeads, setPersonLeads] = useState([]);
//   const [updateData, setUpdateData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     speciality: ""
//   });

//   // Fetch all salespeople stats
//   const fetchSalespeople = async () => {
//     try {
//       console.log("🔗 Fetching salespeople stats from:", `${serverUrl}/api/dashboard/salespeople`);
//       setLoading(true);
//       const res = await axios.get(`${serverUrl}/api/dashboard/salespeople`, { withCredentials: true });
//       console.log("✅ Fetched salespeople stats:", res.data);
//       setSalespeople(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching salespeople stats:", err);
//       toast.error(err.response?.data?.message || "Failed to fetch salespeople stats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all leads - FIXED: Using correct endpoint /api/leads/getlead
//   const fetchAllLeads = async () => {
//     try {
//       console.log("🔗 Fetching leads from:", `${serverUrl}/api/leads/getlead`);
//       const res = await axios.get(`${serverUrl}/api/leads/getlead`, { withCredentials: true });
//       console.log("✅ Fetched leads:", res.data);
//       setAllLeads(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching leads:", err);
//       toast.error(err.response?.data?.message || "Failed to fetch leads");
//     }
//   };

//   // Filter leads for a specific salesperson
//   const getPersonLeads = (salespersonId) => {
//     const leads = allLeads.filter(lead => lead.assigned_to?._id === salespersonId);
//     setPersonLeads(leads);
//     setShowLeadsModal(true);
//   };

//   useEffect(() => {
//     fetchSalespeople();
//     fetchAllLeads();
//   }, [serverUrl]);

//   // Update salesperson info - Using your existing sales/update route
//   const handleUpdate = async () => {
//     try {
//       console.log(`🔄 Updating salesperson ${selectedPerson._id} with:`, updateData);
//       console.log(`🔗 Full URL: ${serverUrl}/api/sales/update/${selectedPerson._id}`);
      
//       // First, let's verify the salesperson exists by trying to fetch it
//       try {
//         const checkRes = await axios.get(`${serverUrl}/api/sales/getSales/${selectedPerson._id}`, { 
//           withCredentials: true 
//         });
//         console.log("✅ Salesperson exists:", checkRes.data);
//       } catch (checkErr) {
//         console.error("❌ Salesperson not found in database:", checkErr.response?.data);
//         toast.error("Salesperson not found in database. Please refresh the page.");
//         return;
//       }
      
//       console.log(`🔄 Updating salesperson ${selectedPerson._id} with:`, updateData);
      
//       // Try the update endpoint first, if it fails, try alternative approaches
//       let res;
//       try {
//         res = await axios.put(`${serverUrl}/api/sales/update/${selectedPerson._id}`, updateData, { 
//           withCredentials: true 
//         });
//       } catch (updateError) {
//         console.log("❌ Update endpoint failed, trying alternative...");
//       console.error("❌ Error details:", {
//         status: err.response?.status,
//         statusText: err.response?.statusText,
//         data: err.response?.data,
//         url: err.config?.url
//       });
//         // If update fails, try using the general sales endpoint with PATCH
//         res = await axios.patch(`${serverUrl}/api/sales/${selectedPerson._id}`, updateData, { 
//           withCredentials: true 
//         });
//       }
      
//       console.log("✅ Salesperson updated:", res.data);
//       toast.success("Salesperson updated successfully");
//       setShowUpdateModal(false);
//       fetchSalespeople(); // Refresh stats
//     } catch (err) {
//       console.error("❌ Error updating salesperson:", err);
      
//       // More detailed error logging
//       if (err.response) {
//         console.error("Response data:", err.response.data);
//         console.error("Response status:", err.response.status);
//         console.error("Response headers:", err.response.headers);
//       }
      
//       // Try to provide more helpful error messages
//       let errorMessage = "Failed to update salesperson";
//       if (err.response?.status === 404) {
//         errorMessage = "Update endpoint not found. Please check your backend routes.";
//       } else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       }
      
//       toast.error(errorMessage);
//     }
//   };

//   // Alternative update method using different endpoint structure
//   const handleUpdateAlternative = async () => {
//     try {
//       console.log(`🔄 Alternative update for salesperson ${selectedPerson._id} with:`, updateData);
      
//       // Try using PATCH method instead of PUT
//       const res = await axios.patch(`${serverUrl}/api/sales/update/${selectedPerson._id}`, updateData, { 
//         withCredentials: true 
//       });
      
//       console.log("✅ Salesperson updated:", res.data);
//       toast.success("Salesperson updated successfully");
//       setShowUpdateModal(false);
//       fetchSalespeople(); // Refresh stats
//     } catch (err) {
//       console.error("❌ Error updating salesperson:", err);
//       console.error("❌ Alternative method error details:", {
//         status: err.response?.status,
//         statusText: err.response?.statusText,
//         data: err.response?.data,
//         url: err.config?.url
//       });
//       toast.error(err.response?.data?.message || "Failed to update salesperson with alternative method");
//     }
//   };

//   // Convert a specific lead - Using your existing leads/convert route
//   const handleConvertLead = async (leadId) => {
//     try {
//       console.log(`🔄 Converting lead ${leadId}`);
//       const res = await axios.put(`${serverUrl}/api/leads/convert/${leadId}`, {}, { 
//         withCredentials: true 
//       });
//       console.log("✅ Lead converted:", res.data);
//       toast.success("Lead converted successfully");
//       fetchSalespeople(); // Refresh stats after conversion
//       fetchAllLeads(); // Refresh leads list
//       // Update the leads in modal if open
//       if (showLeadsModal && selectedPerson) {
//         getPersonLeads(selectedPerson._id);
//       }
//     } catch (err) {
//       console.error("❌ Error converting lead:", err);
//       toast.error(err.response?.data?.message || "Failed to convert lead");
//     }
//   };

//   // Update lead status/info - Using your existing leads/modify route
//   const handleUpdateLead = async (leadId, updateData) => {
//     try {
//       console.log(`🔄 Updating lead ${leadId} with:`, updateData);
//       const res = await axios.put(`${serverUrl}/api/leads/modify/${leadId}`, updateData, { 
//         withCredentials: true 
//       });
//       console.log("✅ Lead updated:", res.data);
//       toast.success("Lead updated successfully");
//       fetchAllLeads(); // Refresh leads list
//       // Update the leads in modal if open
//       if (showLeadsModal && selectedPerson) {
//         getPersonLeads(selectedPerson._id);
//       }
//     } catch (err) {
//       console.error("❌ Error updating lead:", err);
//       toast.error(err.response?.data?.message || "Failed to update lead");
//     }
//   };

//   const openUpdateModal = (person) => {
//     setSelectedPerson(person);
//     setUpdateData({
//       name: person.name,
//       email: person.email,
//       phone: person.phone || "",
//       speciality: person.speciality || ""
//     });
//     setShowUpdateModal(true);
//   };

//   const openLeadsModal = (person) => {
//     setSelectedPerson(person);
//     getPersonLeads(person._id);
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <Toaster position="top-right" />
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Salesmen</h1>

//       {salespeople.length === 0 && (
//         <div className="bg-white p-8 rounded-lg shadow-md text-center">
//           <p className="text-gray-500 text-lg">No salespeople found.</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {salespeople.map((person) => {
//           const totalLeads = person.total_leads_handled || 0;
//           const converted = person.successful_conversions || 0;
//           const activeLeads = person.active_leads_count || 0;
//           const successRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) + "%" : "0%";

//           return (
//             <div key={person._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-800">{person.name}</h2>
//                   <p className="text-sm text-gray-500">{person.email}</p>
//                   <p className="text-sm text-gray-500">{person.phone || "No phone"}</p>
//                 </div>
//                 <div className="text-right">
//                   <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                     {person.speciality || "General"}
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 text-center mb-6 bg-gray-50 p-3 rounded-lg">
//                 <div>
//                   <p className="font-bold text-lg text-gray-800">{totalLeads}</p>
//                   <p className="text-gray-500 text-sm">Total Leads</p>
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg text-green-600">{converted}</p>
//                   <p className="text-gray-500 text-sm">Converted</p>
//                 </div>
//                 <div>
//                   <p className="font-bold text-lg text-orange-500">{successRate}</p>
//                   <p className="text-gray-500 text-sm">Success Rate</p>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <div className="bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-green-500 h-2 rounded-full transition-all duration-300" 
//                     style={{width: successRate}}
//                   ></div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">{activeLeads} active leads</p>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => openUpdateModal(person)}
//                     className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
//                   >
//                     Update Info
//                   </button>
//                   <button
//                     onClick={() => openLeadsModal(person)}
//                     className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
//                   >
//                     Manage Leads
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Update Salesperson Modal */}
//       {showUpdateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
//             <h3 className="text-xl font-semibold mb-4">Update Salesperson</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={updateData.name}
//                   onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={updateData.email}
//                   onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="text"
//                   value={updateData.phone}
//                   onChange={(e) => setUpdateData({...updateData, phone: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
//                 <select
//                   value={updateData.speciality}
//                   onChange={(e) => setUpdateData({...updateData, speciality: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Speciality</option>
//                   <option value="Personal Loan">Personal Loan</option>
//                   <option value="Business Loan">Business Loan</option>
//                   <option value="Home Loan">Home Loan</option>
//                   <option value="Car Loan">Car Loan</option>
//                   <option value="Education Loan">Education Loan</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={() => setShowUpdateModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//               >
//                 Update
//               </button>
//               <button
//                 onClick={handleUpdateAlternative}
//                 className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
//               >
//                 Alt Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Leads Management Modal */}
//       {showLeadsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-5/6 max-w-6xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-semibold">
//                 Manage Leads for {selectedPerson?.name}
//               </h3>
//               <button
//                 onClick={() => setShowLeadsModal(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl font-bold"
//               >
//                 ×
//               </button>
//             </div>
            
//             {personLeads.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No leads assigned to this salesperson.</p>
//             ) : (
//               <div className="space-y-4">
//                 {personLeads.map((lead) => (
//                   <LeadCard 
//                     key={lead._id} 
//                     lead={lead} 
//                     onConvert={handleConvertLead}
//                     onUpdate={handleUpdateLead}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Separate LeadCard component for better organization
// const LeadCard = ({ lead, onConvert, onUpdate }) => {
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [leadData, setLeadData] = useState({
//     status: lead.status,
//     annual_income: lead.annual_income,
//     loan_amount: lead.loan_amount,
//     credit_history: lead.credit_history,
//     urgency: lead.urgency
//   });

//   const handleUpdateLead = () => {
//     onUpdate(lead._id, leadData);
//     setShowUpdateForm(false);
//   };

//   return (
//     <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex-1">
//           <h4 className="font-medium text-gray-800">{lead.name}</h4>
//           <p className="text-sm text-gray-600">{lead.email}</p>
//           <p className="text-sm text-gray-600">{lead.phone}</p>
//         </div>
//         <div className="flex flex-col items-end gap-2">
//           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//             lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
//             lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
//             lead.status === 'Qualified' ? 'bg-blue-100 text-blue-800' :
//             lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
//             'bg-gray-100 text-gray-800'
//           }`}>
//             {lead.status}
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
//         <div>
//           <p className="text-gray-500">Loan Amount</p>
//           <p className="font-medium">₹{lead.loan_amount?.toLocaleString()}</p>
//         </div>
//         <div>
//           <p className="text-gray-500">Annual Income</p>
//           <p className="font-medium">₹{lead.annual_income?.toLocaleString()}</p>
//         </div>
//         <div>
//           <p className="text-gray-500">Credit History</p>
//           <p className="font-medium">{lead.credit_history}</p>
//         </div>
//         <div>
//           <p className="text-gray-500">Urgency</p>
//           <p className="font-medium">{lead.urgency}</p>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span className={`px-2 py-1 rounded text-xs ${
//             lead.priority === 'High' ? 'bg-red-100 text-red-800' :
//             lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//             'bg-green-100 text-green-800'
//           }`}>
//             {lead.priority} Priority
//           </span>
//           <span className="text-xs text-gray-500">Score: {lead.score}</span>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => setShowUpdateForm(!showUpdateForm)}
//             className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
//           >
//             {showUpdateForm ? 'Cancel' : 'Update'}
//           </button>
//           {lead.status !== 'Converted' && lead.status !== 'Lost' && (
//             <button
//               onClick={() => onConvert(lead._id)}
//               className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
//             >
//               Convert
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Update Lead Form */}
//       {showUpdateForm && (
//         <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//           <h5 className="font-medium mb-3">Update Lead</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 value={leadData.status}
//                 onChange={(e) => setLeadData({...leadData, status: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="New">New</option>
//                 <option value="Contacted">Contacted</option>
//                 <option value="Qualified">Qualified</option>
//                 <option value="Converted">Converted</option>
//                 <option value="Lost">Lost</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Credit History</label>
//               <select
//                 value={leadData.credit_history}
//                 onChange={(e) => setLeadData({...leadData, credit_history: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="Poor">Poor</option>
//                 <option value="Average">Average</option>
//                 <option value="Good">Good</option>
//                 <option value="Excellent">Excellent</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
//               <input
//                 type="number"
//                 value={leadData.annual_income}
//                 onChange={(e) => setLeadData({...leadData, annual_income: Number(e.target.value)})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
//               <input
//                 type="number"
//                 value={leadData.loan_amount}
//                 onChange={(e) => setLeadData({...leadData, loan_amount: Number(e.target.value)})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setShowUpdateForm(false)}
//               className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpdateLead}
//               className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
//             >
//               Update Lead
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageSalesmen;