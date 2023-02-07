const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const user = require("../models/user");
const match = require("../models/match");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const moment = require("moment");
const matchLogs = require("../models/matchLogs");
const settings = require("../models/settings");
function adminService() { }
adminService.adduser = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataExist = await user.findOne({ username: obj.username });
      if (dataExist) {
        resolve({ message: "User Already exist" });
      } else {
        obj.slag = obj.password;
        obj.password = await common.encryptPassword(obj.password);
        obj.level = 3;
        obj.isActive = true;
        let addu = new user(obj);
        addu.save();
        resolve(addu);
      }
    } catch (err) {
      console.log("err",err);
      reject(err);
    }
  });
};
adminService.getUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {      
      let data = await user.find({ level: 3 }).lean();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.updateUser = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {      
      let hashPassword = await common.encryptPassword(reqBody.password);
      let data = user
        .updateOne(
          { username: reqBody.username },
          { $set: { slag: reqBody.password, password: hashPassword } }
        );
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.UpdateSettings = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let createdBy = reqBody.createdBy;
      delete reqBody.createdBy;
      // console.log(reqBody);
      await redisdb.SetRedis("providers", JSON.stringify(reqBody));
      await match.updateMany(
        { isActive: true, isResult: false },
        {
          $set: {
            oddsProvider: reqBody.odds,
            fancyProvider: reqBody.fancy,
            bmProvider: reqBody.bookmaker,
          },
        }
      );
      let data = {
        eventId: "9",
        type1: "Match",
        type2: "Other",
        value:"provider",
        oddsValue: reqBody.odds,
        fancyValue: reqBody.fancy,
        bmValue: reqBody.bookmaker,
        result: "Other",
        createdBy: createdBy,
        createdAt: new Date(),
      };
      let lg=new matchLogs(data);
      lg.save();
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
};
adminService.settingsData = async(reqBody) =>{
  return new Promise(async (resolve,rejct)=>{
    try {
      await settings.updateOne({},{$set:{
        cricket:reqBody.cricket,
        tennis:reqBody.tennis,
        soccer:reqBody.soccer
      }})
      resolve('succecss')

    } catch(err) {
      reject(err)

    }
  })
}
adminService.matchSettings = async() =>{
  return new Promise(async(resolve,reject)=>{
    try {
      let result = await settings.find().lean();
      resolve(result)

    } catch(err) {
      reject(err)

    }
  })
}
module.exports = adminService;