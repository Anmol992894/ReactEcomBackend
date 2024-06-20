const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ProductModel = mongoose.model("ProductModel");
const protectedRoute = require("../middleware/protectedResource");

// API to get all the product
router.get("/allproducts", (req, res) => {
    ProductModel.find()
        .then((dbPosts) => {
            res.status(200).json({ products: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

// API to edit the products
router.put("/ProductEdit/:ProductId", (req, res) => {
    const updatefields={
        description:req.body.description,
        Name: req.body.Name,
        Brand:req.body.Brand,
        Price:req.body.Price,
        InStock:req.body.InStock
    }
    ProductModel.findByIdAndUpdate(req.params.ProductId, {
        $set:updatefields
    }, {
        new: true //returns updated record
    })
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

// API to create product exclusive for admin
router.post("/createproduct", (req, res) => {
    const { description,InStock, Name, Brand, Price, image } = req.body;
    if (!description || !InStock || !Name || !Brand || !Price || !image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    const postObj = new ProductModel({ description: description,InStock:InStock, Name:Name, Brand:Brand, Price:Price, image: image, author: req.user });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ product: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

// API for comment and review on products 
router.put("/comment", protectedRoute, (req, res) => {

    const comment = { commentText: req.body.commentText,rating:req.body.rating, commentedBy: req.user._id }

    ProductModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true //returns updated record
    }).populate("comments.commentedBy", "_id fullName") //comment owner
        // .populate("author", "_id fullName")// post owner
        .exec((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

// API to get all the comment from the particular product
router.get('/commented/:postId',(req,res)=>{
    ProductModel.findOne({_id:req.params.postId })
    .then((data)=>{
        res.status(200).json({result:data})
    })
    .catch((error)=>{
        console.log(error);
    })
})

// API to get product
router.get('/topfour',(req,res)=>{
    ProductModel.find()
    .then((dbdata)=>{
        res.status(200).json({data:dbdata});
    })
    .catch((error)=>{
        console.log(error);
    })
})
// API to delete product exclusive for admin
router.delete("/deleteadminproduct/:postId", (req, res) => {
    console.log({ _id: req.params.postId });
    ProductModel.findOne({ _id: req.params.postId })
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

// API to search the product
router.get("/searchedproducts/:productName/:brand", (req, res) => {
    ProductModel.find({Name:req.params.productName,Brand:req.params.brand})
        .then((dbPosts) => {
            res.status(200).json({ products: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

module.exports = router;
