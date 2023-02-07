const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const odds = require("../models/odds");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const moment = require("moment");
function adminService() { }
adminService.addOddsData = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {         
         let exist = await odds
            .findOne({ eIdProvider: reqBody.eventId + "-" + reqBody.provider });
         let obj = {
            eIdProvider: reqBody.eventId + "-" + reqBody.provider,
            eventId: reqBody.eventId,
            provider: reqBody.provider,
            data: JSON.stringify(reqBody.data),
         };
         if (exist) {
            await odds
               .updateOne(
                  { eIdProvider: reqBody.eventId + "-" + reqBody.provider },
                  { $set: obj }
               );
         } else {
            obj.active = 1;
            await odds.insertOne(obj);
         }
         resolve(reqBody);
      } catch (err) {
         reject(err);
      }
   });
};
module.exports = adminService;