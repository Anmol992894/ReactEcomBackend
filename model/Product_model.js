const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

// Defining Product Model
const ProductSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Brand: [
        {
            type: String,
            required: true
        }
    ],
    comments: [
        {
            commentText: String,
            rating:String,
            commentedBy: { type: ObjectId, ref: "UserModel" }
        }
    ],
    Price: [
        {
            type: String,
            required: true
        }
    ],
    image: {
        type: String,
        default:"None"
    },
    InStock:{
        type:String,
        required:true
    }
});

mongoose.model("ProductModel", ProductSchema);