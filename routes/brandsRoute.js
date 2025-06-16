import express from "express";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import { createBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, getBrandDeleteCtrl, getBrandUpdateCtrl } from "../controllers/brandCtrl.js";
import isAdmin from "../middleWears/isAdmin.js";

const brandRoutes = express.Router();

brandRoutes.post("/", isLoggedIn, isAdmin, createBrandCtrl)
brandRoutes.get("/", getAllBrandCtrl)
brandRoutes.get("/:id", getSingleBrandCtrl)
brandRoutes.put("/:id", isLoggedIn, isAdmin, getBrandUpdateCtrl)
brandRoutes.delete("/:id/delete", isLoggedIn, isAdmin, getBrandDeleteCtrl)

export default brandRoutes;
