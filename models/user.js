"use strict";
let mongoose = require("mongoose");
let bcrypt = require("bcrypt-nodejs");
let Schema = mongoose.Schema;

let userSchema = new Schema({     
        firstName: { type: String, required:true },
        lastName:  { type: String, required:true },
        email: { type:String, required: true},
        phoneNumber: { type:Number, required: true},
        password: { type: String, required:true},
        available: { type: Boolean, default: true}
}
);


userSchema.pre("save", function(next) {
    let user = this
    if (!user.isModified("password")) return next()

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.passwordCheck = function(password, callback) {
    let user = this;

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return callback(err);

        callback(null, isMatch);
    });
};

module.exports = mongoose.model("User" , userSchema);
