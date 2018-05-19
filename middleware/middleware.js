let jsonwebtoken = require("jsonwebtoken");
let { secretKey } = require('../config/config');
let UserModel = require("../models/user");
let productModel = require("../models/product");

let tokenmw = (userObj,duration = 120000)=>{
    return jsonwebtoken.sign(userObj,secretKey,{
        expiresIn:duration,
    });
};

let authmw = (req,res,next)=>{
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']
    if (!token){
    res.status(200).send({
        status: 403,
        success: false,
        message: "no valid token found"
    });
    return false;
    }
    jsonwebtoken.verify(token,secretKey,(err,decoded)=>{
        console.log("token in mw" , token);
        console.log("decoded" , decoded)
        if (err){ console.log("error", err);return next(err);}
        UserModel.findOne({available:true, id:decoded.id}).exec((err,document)=>{
            if (err) return next(err);
            if (!document){
                res.status(200).send({
                    status:403,
                    success: false,
                    message: "Invalid token found"
                });
                return false;
            }
            req.user = document;
            console.log("doc" , req.user);
            next();
        });
    });
};

module.exports = {
    authmw: authmw,
    tokenmw: tokenmw
};