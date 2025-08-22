import Lead from "../model/leadModel.js";
import Salesperson from "../model/salesModel.js";

// //  Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ status: "Converted" });
    const salespeople = await Salesperson.find();

    const leadScoreDistribution = {
      high: await Lead.countDocuments({ score: { $gte: 80 } }),
      medium: await Lead.countDocuments({ score: { $gte: 50, $lt: 80 } }),
      low: await Lead.countDocuments({ score: { $lt: 50 } }),
    };

    res.status(200).json({
      totalLeads,
      convertedLeads,
      salespeople,
      leadScoreDistribution,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//  Conversion Funnel
export const getConversionFunnel = async (req, res) => {
  try {
    const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];
    const funnel = {};

    for (const status of statuses) {
      funnel[status.toLowerCase()] = await Lead.countDocuments({ status });
    }

    res.status(200).json(funnel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//  Monthly Trends
export const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await Lead.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalLeads: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



import User from "../model/userModel.js";


export const getSalespeopleStats = async (req, res) => {
  try {
    const salespeople = await User.find({ role: "salesman" });
    
    const salespeopleWithStats = await Promise.all(
      salespeople.map(async (person) => {
        // Calculate real stats from Lead model (same as dashboard)
        const totalLeads = await Lead.countDocuments({ assigned_to: person._id });
        const convertedLeads = await Lead.countDocuments({ 
          assigned_to: person._id, 
          status: "Converted" 
        });
        const activeLeads = await Lead.countDocuments({ 
          assigned_to: person._id, 
          status: { $nin: ["Converted", "Lost"] }
        });
        
        const successRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
        
        return {
          _id: person._id,
          name: person.name,
          email: person.email,
          phone: person.phone,
          speciality: person.speciality,
          total_leads_handled: totalLeads,
          successful_conversions: convertedLeads,
          active_leads_count: activeLeads,
          success_rate: Math.round(successRate * 100) / 100,
          createdAt: person.createdAt,
          updatedAt: new Date()
        };
      })
    );
    
    res.status(200).json(salespeopleWithStats);
  } catch (err) {
    console.error("Error fetching salespeople stats:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET individual salesman's stats
export const getSalesmanStats = async (req, res) => {
  try {
    const salesmanId = req.params.id;
    const salesman = await User.findById(salesmanId);
    if (!salesman || salesman.role !== "salesman") {
      return res.status(404).json({ message: "Salesman not found" });
    }

    const totalLeads = await Lead.countDocuments({ assigned_to: salesmanId });
    const convertedLeads = await Lead.countDocuments({ assigned_to: salesmanId, status: "Converted" });
    const activeLeads = await Lead.countDocuments({ assigned_to: salesmanId, status: { $nin: ["Converted", "Lost"] } });
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    res.status(200).json({
      name: salesman.name,
      email: salesman.email,
      phone: salesman.phone,
      speciality: salesman.speciality,
      totalLeads,
      convertedLeads,
      activeLeads,
      conversionRate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
