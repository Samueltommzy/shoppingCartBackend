"use strict";

let userModel = require("../models/user");
let googleModel = require("../models/googleUser");
let express = require("express");
let passport = require("passport");
let Order = require("../models/order");
let Cart = require("../models/cart");
let { authmw,tokenmw } = require("../middleware/middleware");
let csrf = require("csrf");

let csrfProtection = csrf();
//userRoute.use(csrfProtection);
module.exports = (express)=>{
let userRoute = express.Router();
userRoute.get('/profile',(req, res, next)=>{
  Order.find({user:req.user},function(err,orders){
    if(err){
      return res.write('Error');
    }
    let cart;
    orders.forEach((order)=>{
      cart=new Cart(order.cart);
      order.products=cart.generateArray();
    });
    res.render('user/profile',{orders:orders});
  });
});

userRoute.get('/logout',(req, res, next)=>{
 res.status(200).send({
   success: true,
   message: "Successfully logged out"
 })
});

userRoute.use('/',(req, res, next)=>{
  next();
});

userRoute.post('/signup',(req,res,next)=>{
  console.log(req.body);
  let userObj = {
             password:    req.body.user.password,
             firstName:   req.body.user.firstName,
             lastName:    req.body.user.lastName,
             email:       req.body.user.email,
             phoneNumber: req.body.user.phoneNumber,
           
         };
         console.log(userObj);
         userModel.find({ email:userObj.email,available: true}).exec((err,document)=>{
             if (document.length) {
                 res.status(200).send({
                     success: false,
                     message: "sorry email has been used"
                 });
                 return false;
             };
            userModel.find({phoneNumber: userObj.phoneNumber,available:true}).exec((err,document)=>{
              if ( document.length) {
                res.status(200).send({
                  success: false,
                  message: "sorry phone number has been used"
                });
                return false;
              };
           
             let user = new userModel(userObj);
             user.save((err,doc)=>{
                 if(err) return next(err);
                 res.status(200).send({
                     success: true,
                     status: 200,
                     message: "successfully created user",
                     data: doc
                 });
             });
          });
        });
});

userRoute.post('/googlesignIn', (req,res,next)=>{
  let name = req.body.user.name.split(" ");
  let userDetails = {
    firstName: name[0],
    lastName: name[1],
    email: req.body.user.email,
    id: req.body.user.id,
    token: req.body.user.token
  };

  console.log('google user' ,userDetails);
  googleModel.find({email: userDetails.email}).exec((err,doc)=>{
    if (doc.length) {
      res.status(200).send({
        success: true,
        message: "Already signed in",
        status: 201
      });
      return true;
    };

    let user = new googleModel(userDetails);
    user.save((err,doc)=>{
      if(err) return next(err);

      res.status(200).send({
        success: true,
        status:200,
        message: "Google user created",
        data: doc
      });
    });
  });
});

userRoute.post('/signin',(req, res, next)=> {
 let loginDetails = {
   email: req.body.user.email,
   password: req.body.user.password
 }

 userModel.findOne({email:loginDetails.email,available:true}).exec((err,doc)=>{
   console.log(loginDetails.email);
   console.log(loginDetails.password);
   
   if (err) return next(err);
   if (!doc) {
     res.status(401).send({
       success: false,
       message: "wrong email address"
     });
     return false;
   };
   doc.passwordCheck(loginDetails.password,(err,isMatch)=>{
     if (err) return next(err);
     if(!isMatch) {
       res.status(401).send({
         success: false,
         message: "wrong password"
       });
       return false;
     }
     console.log("doc",doc);
     let tokenObj = {
       id:doc.id,
       email: doc.email
     }
     let token = tokenmw(tokenObj);
     res.status(200).send({
       status:200,
       success:true,
       message: "sucessfully logged in",
       data: doc,
       token: token,
       expiresIn: 120000
     })
     
   })
 })
});
return userRoute;
};
