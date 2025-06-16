import express from "express";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import { createCouponsCtrl, deleteCoupon, getAllCoupons, getSingleCoupon, updateCoupon } from "../controllers/couponsCtrl.js";
import isAdmin from "../middleWears/isAdmin.js";

const couponRoutes = express.Router();

couponRoutes.post("/", isLoggedIn,isAdmin, createCouponsCtrl);
couponRoutes.get("/", getAllCoupons);
couponRoutes.get("/single/:id", getSingleCoupon);
couponRoutes.put("/update/:id",isLoggedIn, isAdmin, updateCoupon);
couponRoutes.delete("/delete/:id",isLoggedIn, isAdmin, deleteCoupon);

export default couponRoutes;

