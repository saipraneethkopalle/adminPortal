const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const whiteListSchema = mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    website_id:{type:String,required:true,unique:true},
    date: { type: Date, default: Date.now }
});

whiteListSchema.plugin(uniqueValidator);
module.exports = mongoose.model('whiteList', whiteListSchema);