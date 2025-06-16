import express from "express";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import { createReview } from "../controllers/reviewCtrl.js";
const ReviewRoutes = express.Router();

ReviewRoutes.post("/:productID", isLoggedIn, createReview)
// brandRoutes.get("/", getAllBrandCtrl)
// brandRoutes.get("/:id", getSingleBrandCtrl)
// brandRoutes.put("/:id", getBrandUpdateCtrl)
// brandRoutes.delete("/:id/delete", getBrandDeleteCtrl)

export default ReviewRoutes;
