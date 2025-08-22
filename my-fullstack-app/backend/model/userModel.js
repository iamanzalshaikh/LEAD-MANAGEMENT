import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
     type: String,
      required: true
     },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
     type: String,
     enum: ["admin", "salesman"],
     required: true
  },
  
  // ✅ ADD these missing fields to User model:
  phone: { type: String },
  active_leads_count: { type: Number, default: 0 },
  total_leads_handled: { type: Number, default: 0 },
  successful_conversions: { type: Number, default: 0 },
  success_rate: { type: Number, default: 0 },
  speciality: { type: String }
      
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;