import Lead from "../model/leadModel.js";
import User from "../model/userModel.js";   // ✅ Use User instead of Salesperson

// MANUAL assign lead
export const assignLead = async (req, res) => {
  try {
    const { leadId, salespersonId } = req.body;

    const lead = await Lead.findById(leadId);
    const salesperson = await User.findById(salespersonId);

    if (!lead || !salesperson || salesperson.role !== "salesman") {
      return res.status(404).json({ message: "Lead or salesperson not found" });
    }

    // assign
    lead.assigned_to = salesperson._id;
    await lead.save();

    // update salesperson stats
    salesperson.active_leads_count += 1;
    await salesperson.save();

    return res.status(200).json({
      message: "Lead assigned",
      lead,
      assigned_to: {
        id: salesperson._id,
        name: salesperson.name,
        email: salesperson.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};






// import Lead from "../model/leadModel.js";
// import Salesperson from "../model/salesModel.js";

// // MANUAL assign lead
// export const assignLead = async (req, res) => {
//   try {
//     const { leadId } = req.params;
//     const { salespersonId } = req.body;

//     const lead = await Lead.findById(leadId);
//     const salesperson = await Salesperson.findById(salespersonId);

//     if (!lead) return res.status(404).json({ message: "Lead not found" });
//     if (!salesperson) return res.status(404).json({ message: "Salesperson not found" });

//     // If lead was previously assigned, decrease old salesperson's count
//     if (lead.assigned_to) {
//       await Salesperson.findByIdAndUpdate(
//         lead.assigned_to, 
//         { $inc: { active_leads_count: -1 } }
//       );
//     } else {
//       // If this is first assignment, increment total_leads_handled
//       await Salesperson.findByIdAndUpdate(
//         salespersonId,
//         { $inc: { total_leads_handled: 1 } }
//       );
//     }

//     // Assign to new salesperson
//     lead.assigned_to = salespersonId;
//     await lead.save();

//     // Increase new salesperson's active count
//     await Salesperson.findByIdAndUpdate(
//       salespersonId,
//       { $inc: { active_leads_count: 1 } }
//     );

//     await lead.populate("assigned_to", "name email phone");

//     res.status(200).json({
//       message: "Lead assigned successfully",
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ 
//       message: "Error assigning lead", 
//       error: err.message 
//     });
//   }
// };
