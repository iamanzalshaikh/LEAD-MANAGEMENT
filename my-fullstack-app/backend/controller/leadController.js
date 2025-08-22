import Lead from "../model/leadModel.js";
import User from "../model/userModel.js"; // Use User model instead of Salesperson
import Salesperson from "../model/salesModel.js"; 
// Simple scoring function
const calculatePriority = (score) => {
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
};

const calculateScore = (lead) => {
  let score = 0;
  if (lead.annual_income > 1000000) score += 40;
  else if (lead.annual_income >= 500000) score += 30;
  else if (lead.annual_income >= 300000) score += 20;
  else score += 10;

  if (lead.loan_amount < 500000) score += 25;
  else if (lead.loan_amount <= 2000000) score += 20;
  else score += 15;

  if (lead.credit_history === "Excellent") score += 20;
  else if (lead.credit_history === "Good") score += 15;
  else if (lead.credit_history === "Average") score += 10;
  else score += 5;

  if (lead.urgency === "Within 1 month") score += 15;
  else if (lead.urgency === "1-3 months") score += 10;
  else score += 5;

  return score;
};

// Auto-assign any registered salesman
// Pick salesman with least active leads
const recommendSalesman = async () => {
  // Get all registered salesmen
  const salesmen = await User.find({ role: "salesman" });
  if (!salesmen.length) return null;

  // Sort by active_leads_count to find the least busy salesman
  salesmen.sort((a, b) => a.active_leads_count - b.active_leads_count);
  return salesmen[0];
};

// CREATE Lead
export const createLead = async (req, res) => {
  try {
    req.body.score = calculateScore(req.body); 
    req.body.priority = calculatePriority(req.body.score);

    const lead = await Lead.create(req.body);

    const recommended = await recommendSalesman();
    if (recommended) {
      lead.assigned_to = recommended._id;
      await lead.save();

      // Update the salesman active leads
      recommended.active_leads_count += 1;
      await recommended.save();

      await lead.populate("assigned_to", "name email phone"); // populate only necessary fields
    }

    res.status(201).json({
      message: "Lead created",
      lead,
      recommended_salesperson: recommended?.name || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET all Leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assigned_to", "name email");
    return res.status(200).json(leads);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET single Lead
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assigned_to", "name email");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// FIXED convertLead function - remove duplicate increment
export const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    if (lead.status === "Converted")
      return res.status(400).json({ message: "Lead already converted" });

    // Update lead status
    lead.status = "Converted";
    await lead.save();

    //  Update salesperson stats
    const salesperson = await User.findById(lead.assigned_to);
    if (salesperson && salesperson.role === "salesman") {
     
      salesperson.successful_conversions = (salesperson.successful_conversions || 0) + 1;
      salesperson.active_leads_count = Math.max((salesperson.active_leads_count || 0) - 1, 0);

      // Recalculate success rate
      if (salesperson.total_leads_handled > 0) {
        salesperson.success_rate = (salesperson.successful_conversions / salesperson.total_leads_handled) * 100;
      }

      await salesperson.save();
    }

    return res.status(200).json({ message: "Lead converted successfully", lead, salesperson });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// UPDATE Lead
export const updateLead = async (req, res) => {
  try {
    const fields = ["annual_income", "loan_amount", "credit_history", "urgency"];
    if (fields.some(f => f in req.body)) {
      req.body.score = calculateScore(req.body);
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("assigned_to", "name email"); // populate only name & email

    return res.status(200).json({ message: "Lead updated", lead });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE Lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



