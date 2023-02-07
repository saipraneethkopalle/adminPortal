const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const activeFancySchema = mongoose.Schema({
   eventId: { type: String, required: true },
   selectionId: { type: String, required: true, unique: true },
   runnerId: { type: String, required: true },
   provider: { type: String, required: true },
   name: { type: String, required: true },
   status: { type: String, required: true },
   result: { type: String },
   resultBy: { type: String },
   type: { type: String }
}, { timestamps: true });

activeFancySchema.index({ eventId: 1, status: 1, provider: 1 });
activeFancySchema.plugin(uniqueValidator);
module.exports = mongoose.model('ActiveFancy', activeFancySchema);