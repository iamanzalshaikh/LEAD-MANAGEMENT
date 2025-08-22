import mongoose from "mongoose";

const salespersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    active_leads_count: {
      type: Number,
      default: 0,
    },
    total_leads_handled: {
      type: Number,
      default: 0,
    },
    successful_conversions: {
      type: Number,
      default: 0,
    },
    success_rate: {
      type: Number,
      default: 0, // Can be calculated on the fly
    },
    speciality: {
      type: String, // e.g., Personal / Business / Property
    },
  },
  { timestamps: true }
);

const Salesperson = mongoose.model("Salesperson", salespersonSchema);
export default Salesperson;
