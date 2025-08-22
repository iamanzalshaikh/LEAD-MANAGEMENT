import express from "express";
import { assignLead } from "../controller/assignmentController.js";


const assignmentRouter = express.Router();

assignmentRouter.post("/assign", assignLead);  // Assign a lead manually (or with auto recommendation)

export default assignmentRouter;
