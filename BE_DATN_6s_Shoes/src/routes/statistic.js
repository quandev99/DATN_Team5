import express from "express";
import { CountBillToday } from "../controller/statistics/index.js";
import { getMonthlyRevenue } from "../controller/statistics/monthlyRevenue.js";
import { getYearlyRevenue } from "../controller/statistics/yearlyRevenue.js";
import { getWeeklyRevenue } from "../controller/statistics/weeklyRevenue.js";
import { TopSelling } from "../controller/statistics/topSeling.js";

const Router = express.Router();

Router.get("/statistics/count-bill-today", CountBillToday);
Router.get("/revenue/:year", getMonthlyRevenue);
Router.get("/yearly-revenue", getYearlyRevenue);
Router.get("/revenue/:year/:month/weekly", getWeeklyRevenue);
Router.get("/products-sell", TopSelling);

export default Router;
