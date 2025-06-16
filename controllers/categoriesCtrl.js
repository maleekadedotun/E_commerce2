import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// @desc create new category
// @route POST/api/v1/categories
// @access Private/admin

export const createCategoryCtrl = asyncHandler(async (req, res) =>{
    const {name} = req.body;
    const categoryFound = await Category.findOne({name});
    if (categoryFound) {
        throw new Error("Category already exists")
    }
    // create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path
    })
    res.json({
        status: "Success",
        message: "Category created successfully",
        category,
    })
});

// @desc get all category
// @route POST/api/v1/categories
// @access Public

export const getAllCategoryCtrl = asyncHandler(async (req, res) =>{
   const categories = await Category.find()
    res.json({
        status: "Success",
        message: "Categories created successfully",
        categories,
    })
});

// @desc get single category
// @route get/api/v1/:id
// @access Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) =>{
    const category = await Category.findById(req.params.id)
    res.json({
        status: "Success",
        message: "category fetched successfully",
        category,
    })
});




// @desc Update single category
// @route Put/api/v1/:id
// @access Public

export const getCategoryUpdateCtrl = asyncHandler(async (req, res) =>{
    const {name} = req.body
   const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name,
        },
        {
            new: true
        }
    );
   
    res.json({
        status: "Success",
        message: "Category updated successfully",
        updateCategory,
    })
});

// @desc Delete category
// @route delete/api/v1/:id
// @access Public

export const getCategoryDeleteCtrl = asyncHandler(async (req, res) =>{
    const category = await Category.findByIdAndDelete(req.params.id)
    res.json({
        status: "Success",
        message: "Category deleted successfully",
    })
});


