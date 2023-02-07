const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
   cricket: { type: String},
   tennis:{type:String},
   soccer:{type:String},
   date : { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('settings', userSchema);