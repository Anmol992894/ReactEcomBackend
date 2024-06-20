const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const OrderModel = mongoose.model("OrderModel");
const protectedRoute = require("../middleware/protectedResource");


// Creating myorder data
router.post("/myorder", (req, res) => {
    const { cartItems, shippingAddress, orderSummary } = req.body;
    if (!cartItems || !shippingAddress || !orderSummary) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    const postObj = new OrderModel({ cartItems: cartItems, shippingAddress: shippingAddress,orderSummary: orderSummary, author: req.user});
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ product: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

// API to get all the order data
router.get("/orderHistory", (req, res) => {
    OrderModel.find()
        .then((dbPosts) => {
            res.status(200).json({ products: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});


module.exports=router;