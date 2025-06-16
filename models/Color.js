import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ColorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    
    // products: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Product",
    //     },   
    // ],
    
},
    {
        timestamps: true,
        toJSON: { virtuals: true },

    }
);

// compile the schema to model

const Color = mongoose.model("Color", ColorSchema);

export default Color;