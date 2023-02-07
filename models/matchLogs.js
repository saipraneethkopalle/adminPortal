const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const matchLogsSchema = mongoose.Schema({
   eventId: { type: String, required: true },
   type1: { type: String, required: true },
   type2: { type: String, required: true },
   value: { type: String, required: true },
   oddsValue:{type:String},
   fancyValue:{type:String},
   bmValue:{type:String},
   result: { type: String, required: true },
   result1: { type: String },
   selectionId: { type: String },
   createdBy: { type: String, required: true },
}, { timestamps: true });

matchLogsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('MatchLogs', matchLogsSchema);