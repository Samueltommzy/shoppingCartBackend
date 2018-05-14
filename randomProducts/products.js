let express = require("express");
let router = express.Router();
let faker = require("faker");
let Product = require("../models/product");


router.get('/',(req,res,next)=>{
    for (let i = 0;i<20;i++){
        let product = new Product({
            productName: faker.commerce.productName(),
            productPrice: faker.commerce.price(),
            productdescription: faker.lorem.paragraph(),
            image: faker.image.imageUrl
        });
        product.save();
        console.log("products",product);
    }
    //res.redirect('/');
}
)
module.exports = router;