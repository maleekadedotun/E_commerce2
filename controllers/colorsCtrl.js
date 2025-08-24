import asyncHandler from "express-async-handler";
import Color from "../models/Color.js";

// @desc create new color
// @route POST/api/v1/color
// @access Private/admin

export const createColorCtrl = asyncHandler(async (req, res) =>{
    const {name} = req.body;
    const colorFound = await Color.findOne({name});
    if (colorFound) {
        throw new Error("Color already exists")
    }
    // create
    const color = await Color.create({
        name: name?.toLowerCase(),
        user: req.userAuthId,
    })
    res.json({
        status: "Success",
        message: "Color created successfully",
        color,
    })
});

// @desc get all color
// @route POST/api/v1/colors
// @access Public

export const getAllColorsCtrl = asyncHandler(async (req, res) =>{
   const colors = await Color.find()
    res.json({
        status: "Success",
        message: "Color created successfully",
        colors,
    })
});

// @desc get single color
// @route get/api/v1/:id
// @access Public
export const getSingleColorCtrl = asyncHandler(async (req, res) =>{
    const color = await Color.findById(req.params.id)
    res.json({
        status: "Success",
        message: "Color fetched successfully",
        color,
    })
});




// @desc Update single color
// @route Put/api/v1/:id
// @access Public

export const getColorUpdateCtrl = asyncHandler(async (req, res) =>{
    const {name} = req.body
   const updateColor = await Color.findByIdAndUpdate(
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
        message: "Color updated successfully",
        updateColor,
    })
});

// @desc Delete brand
// @route delete/api/v1/:id
// @access Public

export const getColorDeleteCtrl = asyncHandler(async (req, res) =>{
    const color = await Color.findByIdAndDelete(req.params.id)
    res.json({
        status: "Success",
        message: "Color deleted successfully",
    })
});


