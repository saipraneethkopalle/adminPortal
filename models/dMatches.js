const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const dMatchesSchema = mongoose.Schema({
   eventId: { type: String, required: true, unique: true },
   eventName: { type: String, required: true },
   marketId: { type: String, required: true },
   marketName: { type: String, required: true },
   sportId: { type: String, required: true },
   sportName: { type: String, required: true },
   openDate: { type: String, required: true },
   type: { type: String },
}, { timestamps: true });

dMatchesSchema.index({ eventId: 1, type: 1 });
dMatchesSchema.plugin(uniqueValidator);
module.exports = mongoose.model('dMatches', dMatchesSchema);