import express from "express";
import { createSalesperson, getSalespeople, getSalespersonById, updateSalesperson } from "../controller/salesController.js";


const salesRouter = express.Router();

salesRouter.post("/", createSalesperson);   // Create a salesperson

salesRouter.get("/", getSalespeople);             // Get all salespeople
salesRouter.get("/getSales/:id", getSalespersonById);     // Get a single salesperson
salesRouter.put("/update/:id", updateSalesperson);      // Update a salesperson

export default salesRouter;




// import express from "express";
// import {
//   getSalespeople,
//   getSalespersonById,
//   updateSalesperson,
//   getSalespeopleStats,
//   deleteSalesperson
// } from "../controller/salesController.js";

// const salesRouter = express.Router();

// // GET all salespeople (optional query by name)
// salesRouter.get("/", getSalespeople);

// // GET single salesperson by ID
// salesRouter.get("/:id", getSalespersonById);

// // UPDATE salesperson stats by ID
// salesRouter.put("/:id", updateSalesperson);

// // GET salespeople performance stats
// salesRouter.get("/stats/performance", getSalespeopleStats);

// // DELETE salesperson by ID
// salesRouter.delete("/:id", deleteSalesperson);

// export default salesRouter;



