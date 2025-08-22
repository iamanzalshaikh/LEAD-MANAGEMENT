import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    annual_income: {
      type: Number,
      required: true,
    },
    loan_amount: {
      type: Number,
      required: true,
    },
    credit_history: {
      type: String, // Excellent / Good / Average / Poor
      required: true,
    },
    urgency: {
      type: String, // Within 1 month / 1-3 months / 3+ months
      required: true,
    },
    score: {
      type: Number, // Calculated automatically
    },
    priority: {
      type: String, // High / Medium / Low
      default: "Low",
    },
assigned_to: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",  // Change from "Salesperson" to "User"
  default: null,
},
    status: {
      type: String,
      default: "New", // New / Contacted / In Progress / Converted / Lost
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;