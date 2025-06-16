import express from "express";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import { createColorCtrl, getAllColorsCtrl,getSingleColorCtrl, getColorUpdateCtrl, getColorDeleteCtrl } from "../controllers/colorsCtrl.js";
import isAdmin from "../middleWears/isAdmin.js";

const colorRoutes = express.Router();


colorRoutes.post("/", isLoggedIn, isAdmin, createColorCtrl)
colorRoutes.get("/", getAllColorsCtrl)
colorRoutes.get("/:id", getSingleColorCtrl)
colorRoutes.put("/:id",isLoggedIn,isAdmin, getColorUpdateCtrl)
colorRoutes.delete("/:id/delete", isLoggedIn, isAdmin, getColorDeleteCtrl)

export default colorRoutes;
