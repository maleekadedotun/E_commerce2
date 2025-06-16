import express, { application } from "express";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import { createOrder, getAllOrdersCtrl, getSingleOrderCtrl, updateOrderCtrl, getOrderStatsCtrl } from "../controllers/orderCtrl.js";
const orderRoutes = express.Router();

orderRoutes.post("/", isLoggedIn, createOrder);
orderRoutes.get("/", isLoggedIn, getAllOrdersCtrl);
orderRoutes.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
orderRoutes.get("/single/:id", isLoggedIn, getSingleOrderCtrl);
orderRoutes.put("/update/:id", isLoggedIn, updateOrderCtrl);

export default orderRoutes;