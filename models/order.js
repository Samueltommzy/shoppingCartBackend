let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let orderSchema = new Schema({
   user: { type: Schema.Types.ObjectId,ref:'User'},
   cart: { type: Object,required: true},
 });
 module.exports = mongoose.model("OrderModel", orderSchema);