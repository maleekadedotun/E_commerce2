import express from "express";
import { createCategoryCtrl, getAllCategoryCtrl, getCategoryDeleteCtrl, getCategoryUpdateCtrl, getSingleCategoryCtrl } from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import upload from "../config/fileUpload.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, upload.single("file"), createCategoryCtrl)
categoriesRouter.get("/", getAllCategoryCtrl)
categoriesRouter.get("/:id", getSingleCategoryCtrl)
categoriesRouter.put("/:id", getCategoryUpdateCtrl)
categoriesRouter.delete("/:id/delete", getCategoryDeleteCtrl)

export default categoriesRouter;
