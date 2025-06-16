import Product from "../models/Product.js";
import Review from "../models/Review.js";
import asyncHandler from "express-async-handler";

// @desc create new review
// @route POST/api/v1/reviews
// @access Private/admin

export const createReview = asyncHandler(async(req, res) =>{  

   // find the product
   const {message, rating} = req.body
   const {productID} = req.params;
   const productFound = await Product.findById(productID).populate("reviews")
   if (!productFound) {
        throw new Error("Product Not Found")
    }
   // check if user already review product
    const hasReviewed = productFound?.reviews?.find((review) => {
        return review?.user?.toString() === req?.userAuthId?.toString();
    });
    if (hasReviewed) {
        throw new Error("You have already reviewed this product")
    }
//   console.log(hasReviewed);
  
   // create check
   const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId,
    });
    // push review into product found
    productFound.reviews.push(review?._id);
    await productFound.save();

    res.status(201).json({
        success: true,
        message: "Review has been created successfully"
    })
})
