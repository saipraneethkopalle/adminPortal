const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const whiteList = require("../models/whiteList");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const moment = require("moment");
function adminService() { }
adminService.addWhitelistWebsite = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataExist = await whiteList
        .findOne({ name: obj.name });
      if (dataExist) {
        resolve({ message: "Website Already exist." });
      } else {
        obj.website_id = uuid();
        let data = new whiteList(obj);
        data.save();
      }
      resolve(obj);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getWebsiteData = async (website_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataExist = await whiteList
        .findOne({ website_id: website_id });
      if (dataExist) {
        resolve(dataExist);
      } else {
        reject("Website Not Found");
      }
    } catch (err) {
      reject(err);
    }
  });
};
adminService.removeWhitelistData = async (website_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataExist = await whiteList
        .deleteOne({ website_id: website_id });
      if (dataExist) {
        resolve("Deleted Successfully");
      } else {
        reject("Invalid Website Id");
      }
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getAllWebsite = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await whiteList.find().lean();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.removeWebsite = async (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("i am inside the admin service");
      let query = await whiteList.deleteOne({ name: name });
      resolve(query);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = adminService;