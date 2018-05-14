let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let inventorySchema = new Schema({
    quantity: { type:Number},
    reservations: {type: Array}
 });
 module.exports = mongoose.model("CartModel", cartSchema);