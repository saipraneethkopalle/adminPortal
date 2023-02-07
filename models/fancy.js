const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const fancySchema = mongoose.Schema({
   eventP: { type: String, required: true, unique: true },
   eventId: { type: String, required: true },
   type: { type: String, required: true },
   provider: { type: String, required: true },
   data: { type: String, required: true },
   active: { type: String }
}, { timestamps: true });

fancySchema.index({ eventId: 1, provider: 1 });
fancySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Fancy', fancySchema);