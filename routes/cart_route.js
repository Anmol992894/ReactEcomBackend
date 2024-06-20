const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const CartModel = mongoose.model("CartModel");
const protectedRoute = require("../middleware/protectedResource");

//all products only from logged in user
router.get("/myallproducts", (req, res) => {
    CartModel.find()
        // .populate("author", "_id fullName profileImg")
        .then((dbPosts) => {
            res.status(200).json({ product: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

// Cart Route to create product
router.post("/createmyproduct",protectedRoute, (req, res) => {
    const { description, Quantity, Name, Brand, Price, image } = req.body;
    if (!description|| !Quantity || !Name || !Brand || !Price || !image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    const postObj = new CartModel({ description: description, Name:Name,Quantity:Quantity, Brand:Brand, Price:Price, image: image, author: req.user});
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ product: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

// Delete cart Product
router.delete("/deleteMyproduct/:postId", (req, res) => {
    console.log({ _id: req.params.postId });
    CartModel.findOne({ _id: req.params.postId })
        // .populate("author", "_id")
        .exec((error, postFound) => {
            if (error || !postFound) {
                return res.status(400).json({ error: "Post does not exist" });
            }
            //check if the post author is same as loggedin user only then allow deletion
                postFound.remove()
                    .then((data) => {
                        res.status(200).json({ result: data });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
        })
});

// Delete whole cart data
router.delete("/deletewholeCart",(req,res)=>{
    CartModel.deleteMany({})
    .then((data)=>{
        return res.status(200).json({success:"Deleted"})
    })
    .catch((error)=>{
        console.log(error);
    })
})

module.exports = router;
