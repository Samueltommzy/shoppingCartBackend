let jsonwebtoken = require("jsonwebtoken");
let { secretKey } = require('../config/config');
let UserModel = require("../models/user");

let tokenmw = (userObj,duration = 86400)=>{
    return jsonwebtoken.sign(userObj,secretKey,{expiresIn:duration});
};

let authmw = (req,res,nex)=>{
    let token = req.body.token || request.query.token || req.headers['x-access-token'];
    if (!token){
    res.status(200).send({
        status: 403,
        success: false,
        message: "no valid token found"
    });
    return false;
    }
    jsonwebtoken.verify(token,secretKey,(err,decoded)=>{
        if (err) return next(err);
        UserModel.findOne({_id:decoded._id,available:true}).exec((err,document)=>{
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
            next();
        });
    });
};

module.exports = {
    authmw: authmw,
    tokenmw: tokenmw
};