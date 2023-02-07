const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const matchSchema = new mongoose.Schema({
   eventId: { type: String, required: true,unique:true},
   eventName: { type: String, required: true },
   marketId: { type: String, required: true },
   marketIds: { type: Array, required: true },
   markets: { type: Array, "default": [], required: true },
   mEventId: { type: String, "default": "0", required: true },
   marketName: { type: String, required: true },
   matchRunners: { type: Array, "default": [], required: true },
   competitionId: { type: String, required: true },
   competitionName: { type: String, required: true },
   sportId: { type: String, required: true },
   sportName: { type: String, required: true },
   oddsProvider: { type: String, required: true },
   fancyProvider: { type: String, required: true },
   bmProvider: { type: String, required: true, "default": "tiger" },
   fancyAType: { type: String, "default": "manual" },
   addType: { type: String, "default": "all" },
   scoreId: { type: String },
   scoreType: { type: String },
   openDate: { type: String, required: true },
   isActive: { type: Boolean, required: true },
   isResult: { type: Boolean, required: true },
   resultId: { type: String },
   resultName: { type: String },
   type: { type: String },
   matchType: { type: String },
   matchNo: { type: String },
   channelNo: { type: String, default: "" },
   mType: { type: String, default: "normal" }
}, { timestamps: true });

// mongoose.set('useCreateIndex', true);
matchSchema.index({ isActive: 1, isResult: 1});
matchSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Match', matchSchema);