import express from "express";
import { getConversionFunnel, getDashboardStats, getMonthlyTrends, getSalesmanStats, getSalespeopleStats } from "../controller/dashboardController.js";


const dashboardRouter = express.Router();

dashboardRouter.get("/stats", getDashboardStats); 
dashboardRouter.get("/funnel", getConversionFunnel);   
dashboardRouter.get("/monthly-trends", getMonthlyTrends);
// In your dashboardRouter
dashboardRouter.get("/salespeople", getSalespeopleStats);
dashboardRouter.get("/salesman/:id/stats", getSalesmanStats);


export default dashboardRouter;
