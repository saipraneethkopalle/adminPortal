const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const mlogs = require("../models/matchLogs");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const moment = require("moment");
function adminService() { }
adminService.getMatchActivities = async (query, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let finalResult;            
            let result = await mlogs.find(query).lean()
            let result2 = await mlogs.find({ eventId: '9' }).lean();
            // console.log("type is ",type)
            if (type == '') {
                finalResult = [...result, ...result2]
            } else {
                finalResult = result;
            }
            //  finalResult = [...result,...result2]
            finalResult = finalResult.sort((a, b) => moment(b.createdAt) - moment(a.createdAt));
            resolve(finalResult)
        } catch (err) {
            reject(err)
        }
    });
}
adminService.getFancyActivity = async (match) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            let activities = await mlogs.find(match).lean();
            activities = activities.sort(
                (a, b) => moment(b.createdAt) - moment(a.createdAt)
            );
            resolve(activities);
        } catch (err) {
            reject(err);
        }
    });
};
adminService.insertMatchLogs = async (matchLogs) => {
    return new Promise(async (resolve, reject) => {
      try {
        let logs = await mlogs.insertMany(matchLogs, { ordered: false });
        resolve(logs);
      } catch (err) {
        reject(err);
      }
    });
  };
  adminService.addMatchLogs = async (matchLogs) => {
    return new Promise(async (resolve, reject) => {
      try {
        matchLogs.createdAt = new Date().toISOString();
        let activityLog = await mlogs.findOne({
            eventId: matchLogs.eventId,
            selectionId: matchLogs.selectionId,
            value: matchLogs.value,
          });
        if (activityLog) {
          await mlogs.updateOne(              {
                eventId: matchLogs.eventId,
                selectionId: matchLogs.selectionId,
                value: matchLogs.value,
              },
              { $set: matchLogs }
            );
        } else {
          let log =new mlogs(matchLogs);
          log.save();
        }
        resolve(matchLogs);
      } catch (err) {
        reject(err);
      }
    });
  };
module.exports = adminService;