"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let googleschema = new Schema({
        firstName: { type: String,required: true},
        lastName: { type: String,required: true},
        email: { type: String,required: true},
        id: { type: String, required:true},
        token: { type: String, required: true}
});

module.exports =mongoose.model("googleUser", googleschema);
