let express = require("express");
let cartRoute =  express.Router();
let Cart = require("../models/cart");

cartRoute.get('/', (req,res,next)=>{
    Cart.find({available:true}).exec((err,document)=>{
        if(err) return next(err);
        console.log("products", document);
        res.status(200).send({
            status: 200,
            success: true,
            message: "Cart loaded",
            data: document
        });
    });
});
cartRoute.put('/add' , (req,res,next)=>{
    let cartObj = {
     products : req.body.product
    }
})



module.exports = productRoute;