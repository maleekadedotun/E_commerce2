import express from "express";

import upload from "../config/fileUpload.js";
import { isLoggedIn } from "../middleWears/isLoggedIn.js";
import { createProductCtrl, getProductsCtrl, getProductCtrl, getProductUpdateCtrl, getProductDeleteCtrl} from "../controllers/productCtrl.js";
import isAdmin from "../middleWears/isAdmin.js";
const productRouter = express.Router();

productRouter.post("/",isLoggedIn, isAdmin,upload.array("files"), createProductCtrl)
productRouter.get("/", getProductsCtrl)
productRouter.get("/:id", getProductCtrl)
productRouter.put("/:id",isLoggedIn, isAdmin, getProductUpdateCtrl)
productRouter.delete("/:id/delete",isLoggedIn, isAdmin,getProductDeleteCtrl)


export default productRouter; 
