// review Schema
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Review must belong to user"],
        ref: "User",
    },
    
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Review must belong to Product"],
    },  

    message: {
        type: String,
        required: [true, "Please add a message"],
    },

    rating: {
        type: Number,
        required: [true, "Please add rating between 1 and 5"],
        min: 1,
        max: 5,
    }
    
},
    {
        timestamps: true,
        toJSON: { virtuals: true },

    }
);

// compile the schema to model

const Review = mongoose.model("Review", ReviewSchema);

export default Review;