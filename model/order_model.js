const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

// Defining Order Model
const OrderSchema = new mongoose.Schema({
    cartItems: {
        type: [],
        required: true
    },
    shippingAddress: {
        type: [],
        required: true
    },
    orderSummary:{
        type:[],
        required:true
    },
    author: {
        type: ObjectId,
        ref: "UserModel"
    }
});

mongoose.model("OrderModel", OrderSchema);