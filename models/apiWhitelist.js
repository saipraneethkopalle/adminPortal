const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const apiWhiteListSchema = mongoose.Schema({
   customerName: { type: String,required:true},
   ipAddress:{type:String,required:true},
   plan1:{type:Boolean,default:true},
   plan2:{type:Boolean,default:true},
   plan3:{type:Boolean,required:true},
   createdAt:{type:Date,default:Date.now}
//    date : { type: Date, default: Date.now }
});

apiWhiteListSchema.plugin(uniqueValidator);
module.exports = mongoose.model('apiWhitelist', apiWhiteListSchema);