import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    image: {
        type: String,
        required: true,
    },
    
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },   
    ],
    
},
    {
        timestamps: true,
        toJSON: { virtuals: true },

    }
);

// compile the schema to model

const Category = mongoose.model("Category", CategorySchema);

export default Category;