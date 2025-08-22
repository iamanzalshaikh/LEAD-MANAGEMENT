import Salesperson from "../model/salesModel.js";
// import User from "../model/userModel.js";
// GET all salespeople
// CREATE salesperson

export const createSalesperson = async (req, res) => {
  try {
    const salesperson = await Salesperson.create(req.body);
    return res.status(201).json({
      message: "Salesperson created successfully",
      salesperson,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};




export const getSalespeople = async (req, res) => {
  try {
    // ✅ Changed from Salesperson.find({}) to User.find({ role: "salesman" })
    const salespeople = await User.find({ role: "salesman" });
    return res.status(200).json(salespeople);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// GET single salesperson
export const getSalespersonById = async (req, res) => {
  try {
    const salesperson = await Salesperson.findById(req.params.id);
    if (!salesperson) return res.status(404).json({ message: "Salesperson not found" });
    return res.status(200).json(salesperson);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE salesperson
import User from "../model/userModel.js";

export const updateSalesperson = async (req, res) => {
  try {
    const salesperson = await Salesperson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!salesperson) return res.status(404).json({ message: "Salesperson not found" });

    // Recalculate success rate if total_leads_handled > 0
    if (salesperson.total_leads_handled > 0) {
      salesperson.success_rate =
        (salesperson.successful_conversions / salesperson.total_leads_handled) * 100;
      await salesperson.save();
    }

    return res.status(200).json({ message: "Salesperson updated", salesperson });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};