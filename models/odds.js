const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const oddsSchema = mongoose.Schema({
   eventP: { type: String, required: true, unique: true },
   eventId: { type: String, required: true },
   type: { type: String, required: true },
   provider: { type: String, required: true },
   data: { type: String, required: true },
   active: { type: String }
}, { timestamps: true });

oddsSchema.index({ eventId: 1, provider: 1 });
oddsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Odds', oddsSchema);