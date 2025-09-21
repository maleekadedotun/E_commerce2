import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

// @desc create new coupons
// @route POST/api/v1/coupons
// @access Private/admin

export const createCouponsCtrl = asyncHandler(async (req, res) =>{
    const {code, startDate, endDate, discount} = req.body
    // check if is Admin
    // check coupon already exist
    const couponsExists = await Coupon.findOne({
        code: code?.toUpperCase(),
    })
    if (couponsExists) {
        throw new Error("Coupon already exist")
        
    }
    // const discountValue = Number(disCount);

    // check if discount is a number
    if (isNaN(discount)) {
        throw new Error("Discount value must be a number")
    }

    // You can also validate before passing to Mongoose:
    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
         throw new Error("Please use a valid date format: YYYY-MM-DD");
    }

    // create Coupon
    const coupon = await Coupon.create({
        code,
        startDate,
        endDate,
        discount,
        user: req.userAuthId,
    })
    
    res.json({
        status: "Success",
        msg: "Coupon created successfully",
        coupon,
    });
});

// @desc all coupons
// @route POST/api/v1/coupons
// @access Private/admin

export const getAllCoupons = asyncHandler(async (req, res) =>{
    const coupons = await Coupon.find();
    res.status(201).json({
        status: "Success",
        msg: "Coupon fetched successfully",
        coupons,
    })
});

// @desc Single coupon
// @route POST/api/v1/coupons
// @access Private/admin

// export const getSingleCoupon = asyncHandler(async (req, res) =>{
//     const coupon = await Coupon.findById(req.params.id);
//     res.json({
//         status: "Success",
//         msg: "Coupon fetched",
//         coupon,
//     })
// });
export const getSingleCoupon = asyncHandler(async (req, res) =>{
    const coupon = await Coupon.findOne({code: req.query.code});
    // check if coupon is found
    if (coupon === null) {
        throw new Error("Coupon not found");
    }
    // check if coupon as expired
    if (coupon.isExpired) {
        throw new Error("Coupon already expired")
    }
   
    res.json({
        status: "Success",
        msg: "Coupon fetched",
        coupon,
    })
});

// @desc update coupon
// @route POST/api/v1/coupons
// @access Private/admin

export const updateCoupon = asyncHandler(async (req, res) =>{
    // ✅ Destructure input fields from the request body
    const { code, discount, startDate, endDate } = req.body; 

   const couponUpdated = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
    },
    {
        new: true,
    }
    );

    res.json({
        status: "Success",
        msg: "coupon updated successfully",
        couponUpdated,
    })
});

// @desc delete coupon
// @route POST/api/v1/coupons
// @access Private/admin

export const deleteCoupon = asyncHandler(async (req, res) =>{
    const { id } = req.params; // ✅ get id from URL params
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        res.status(404)
        throw new Error("Coupon not found");
        
    }
    res.json({
        status: "Success",
        msg: "Coupon deleted successfully",
        id: coupon._id,
    })
});