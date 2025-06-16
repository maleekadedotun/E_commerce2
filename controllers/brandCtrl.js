import asyncHandler from "express-async-handler";
import Brand from "../models/brand.js";

// @desc create new brand
// @route POST/api/v1/brands
// @access Private/admin

export const createBrandCtrl = asyncHandler(async (req, res) =>{
    const {name} = req.body;
    const normalized = name.toLowerCase()
    const brandFound = await Brand.findOne({name: normalized});
    if (brandFound) {
        throw new Error("Brand already exists")
    }
    // create
    const brand = await Brand.create({
        name: normalized,
        user: req.userAuthId,
    })
    res.json({
        status: "Success",
        message: "Brand created successfully",
        brand,
    })
});

// @desc get all brand
// @route POST/api/v1/brands
// @access Public

export const getAllBrandCtrl = asyncHandler(async (req, res) =>{
   const brands = await Brand.find()
    res.json({
        status: "Success",
        message: "Brand created successfully",
        brands,
    })
});

// @desc get single brand
// @route get/api/v1/:id
// @access Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) =>{
    const brand = await Brand.findById(req.params.id)
    res.json({
        status: "Success",
        message: "brand fetched successfully",
        brand,
    })
});




// @desc Update single brand
// @route Put/api/v1/:id
// @access Public

export const getBrandUpdateCtrl = asyncHandler(async (req, res) =>{
    const {name} = req.body
   const updateBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        {
            name,
        },
        {
            new: true
        }
    );
//    await updateBrand.save();
    res.json({
        status: "Success",
        message: "Brand updated successfully",
        updateBrand,
    })
});

// @desc Delete brand
// @route delete/api/v1/:id
// @access Public

export const getBrandDeleteCtrl = asyncHandler(async (req, res) =>{
    const brand = await Brand.findByIdAndDelete(req.params.id)
    res.json({
        status: "Success",
        message: "Brand deleted successfully",
    })
});


