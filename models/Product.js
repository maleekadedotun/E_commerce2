import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    brand: {
        type: String,
        required: true,
    },

    category:[
        {
            type: String,
            ref: "Category",
            required: true,
        }
    ],

    sizes:{
        type: [String],
        enum: ["S", "M","L","XL", "XXL"],
        required: true,
    },

    colors:{
        type: [String],
        required: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    images: [
        {
            type: String,
            // default: "https://via.placeholder.com/150",
        }
    ],
    reviews:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },   
    ],

    price:  {
      type: Number,
      required: true
    },

    totalQty:  {
        type: Number,
        required: true
    },
    
    totalSold:  {
        type: Number,
        required: true,
        default: 0,
    },
    
},
    {
        timestamps: true,
        toJSON: { virtuals: true },

    }
);
// Virtuals
// qtyLeft
ProductSchema.virtual("qtyLeft").get(function(){
    const product = this;
    return product.totalQty - product.totalSold;  

})
// Total Rating

ProductSchema.virtual("totalReviews").get(function(){
    // console.log("this", this);
    const product = this;
    return product?.reviews?.length;
    
});
// Average Rating
ProductSchema.virtual("averageRating").get(function(){
    let ratingsTotal = 0
    const product = this;
    product?.reviews?.forEach((review) =>{
        ratingsTotal += review?.rating;
    });
    // calc the average rating
    const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(1);
    // console.log(averageRating);
    
    return averageRating;
})
// compile the schema to model

const Product = mongoose.model("Product", ProductSchema);

export default Product;