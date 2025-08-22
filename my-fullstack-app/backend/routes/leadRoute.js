import express from "express";
import { convertLead, createLead, deleteLead, getLeadById, getLeads, updateLead } from "../controller/leadController.js";


const leadRouter = express.Router();

leadRouter.post("/create", createLead);        // Create a new lead
leadRouter.get("/getlead", getLeads);           // Get all leads
leadRouter.get("/:id", getLeadById);     // Get a single lead
leadRouter.put("/modify/:id", updateLead);
leadRouter.delete("/remove/:id", deleteLead);
leadRouter.put("/convert/:id", convertLead);


export default leadRouter;
