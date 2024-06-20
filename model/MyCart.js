const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;



// Defining Cart Model
const CartSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Quantity:{
        type: String,
        default:0
    },
    Brand: [
        {
            type: String,
            required: true
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
    author: {
        type: ObjectId,
        ref: "UserModel"
    }
});

mongoose.model("CartModel", CartSchema);