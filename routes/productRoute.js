let express = require("express");
let productRoute =  express.Router();
let product = require("../randomProducts/products");
let Product = require("../models/product");
let Cart = require("../models/cart");
let Order = require("../models/order");
let accountSid ="1234";
let authtoken = "1111";
//let client = require("twilio")(accountSid,authtoken);

productRoute.get('/product', (req,res,next)=>{
    Product.find({}).exec((err,document)=>{
        if(err) return next(err);
        console.log("products", document);
        res.status(200).send({
            status: 200,
            success: true,
            message: "Products loaded",
            data: document
        });
    });
});

productRoute.get('/addtoCart/:id',(req,res,next)=>{
    let productId = req.params.id;
    console.log(productId);
    let cart = new Cart(req.session.cart? req.session.cart: {});
    Product.findById(productId,(err,product)=>{
        console.log("got here",product);
        if (err) return next(err);
        cart.add(product,productId);
        req.session.cart = cart;
        console.log(req.session.cart);
    }).exec((err,doc)=>{
        doc.storedQuantity++;
        doc.productQuantity--;
        if(err) return next(err);
         res.status(200).send({
            success: true,
            message: "product successfully added",
            data: doc
        });
    });
});

productRoute.get('/decrement/:id',(req,res,next)=>{
    let productid = req.params.id;
    let cart = new Cart(req.session.cart? req.session.cart: {});
    cart.decrement(productid);
    req.session.cart = cart;
    res.redirect('/cart');
});

productRoute.get('/cart',(req,res,next)=>{
    if (!req.session.cart) {
        return res.render('cart/cart' , {products:null});
    }
    let cart = new cart(req.session.car);
     res.render('cart/cart',{products:cart.generateArray(), totalPrice:cart.totalPrice});
});

productRoute.get('/checkout', isLoggedIn, (req,res,next)=>{
    if (!req.session.cart) {
        return res.redirect('/cart');
    };
    let cart = new Cart(req.session.cart);
    let err = req.flash('error')[0];
    res.render('/shop/checkout', {total: cart.totalPrice})
});

productRoute.post('/checkout', isLoggedIn ,(req,res,next)=>{
    if(!req.session.cart){
        return res.redirect('/cart');
    }
    let cart = new Cart(req.session.cart);
    let order = new Order({
        user: req.user,
        cart:cart
    });

    order.save((err,result)=>{
        req.session.Cart = null;
        res.redirect('/');
     })
     //.then(()=>{
    //     client.messages.create({
    //         body: `Your order has been processed.Product details: ${order}`,
    //         to: order.user.phonenumber
    //     }).then(message=>{
    //         console.log(message.sid);
    //         if ( message.sid.status == "sent") {
    //             res.status(200).send({
    //                 success:true,
    //                 message: "a confimation sms has been sent"
    //             });
    //         };
    //     }).done();
    // });

});
module.exports = productRoute;
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    };
    req.session.oldUrl = req.url;
   // res.redirect('/user/sign');
}

