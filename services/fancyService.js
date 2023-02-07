const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const fancy = require("../models/fancy");
const activefancy = require("../models/activeFancy");
const mlogs = require("../models/matchLogs");
const matchModel = require('../models/match')
const matchLogsService = require("./matchLogsService");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const moment = require("moment");
function adminService() { }
adminService.getFancy = async () => {
   return new Promise(async (resolve, reject) => {
      try {
         let data = await activefancy.find().lean();
         resolve(data);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.updateFancy = async (marketId, sid, obj) => {
   return new Promise(async (resolve, reject) => {
      try {

         let updateFancy = await activefancy.updateOne({ "Market Id": marketId, sid: sid }, { $set: obj });
         resolve(updateFancy);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.updateMarkStatus = async (reqBody, markStatus) => {
   return new Promise(async (resolve, reject) => {
      try {

         let exist = await activefancy.findOne({ eventId: reqBody["eventId"], sid: reqBody.sid });
         if (exist) {
            let updateFancy = await activefancy.updateOne(
                  { eventId: reqBody["eventId"], sid: reqBody.sid },
                  { $set: { active: markStatus } }
               );
         } else {
            reqBody.active = markStatus;
            let fa= new activefancy(reqBody);
            fa.save();
         }
         let result = await activefancy
            .find({ eventId: reqBody["eventId"], active: markStatus })
            .lean();

         resolve(result);
      } catch (err) {
         reject(err);
      }
   });
};

adminService.updateClosing = async (reqBody, closed) => {
   return new Promise(async (resolve, reject) => {
      try {

         let doc = await activefancy.findOne({ eventId: reqBody["eventid"], runnerId: reqBody.id });
         // console.log("doc===",doc);
         let activityLog = {
            eventId: reqBody.eventid,
            type1: "Fancy",
            type2: doc.provider,
            value: "Closed",
            result: doc.name,
            result1: reqBody.winner,
            selectionId: reqBody.id,
            createdBy: reqBody.createdBy,
         };
         await matchLogsService.addMatchLogs(activityLog);
         let updateFancy = await activefancy.updateOne(
               { eventId: reqBody["eventid"], runnerId: reqBody.id },
               { $set: { status: "Closed", result: reqBody.winner } }
            );
         resolve(updateFancy);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.updateRollback = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {

         let createdBy = reqBody.createdBy;
         delete reqBody.createdBy;
         let updateFancy = await activefancy.findOneAndUpdate(
               { eventId: reqBody["eventId"], selectionId: reqBody.id },
               { $set: { status: "Active", result: "" } }
            );
            let matchLogs = new mlogs({
               eventId: reqBody.eventId,
               type1: 'Fancy',
               type2: updateFancy.provider,
               value: 'Rollback',
               result: updateFancy.name,
               result1: reqBody.winner||" ",
               selectionId: reqBody.id,
               createdBy: createdBy
           });
           matchLogs.save();
         resolve(updateFancy);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.insertAll = async (fancydata, logs) => {
   return new Promise(async (resolve, reject) => {
      try {

         if (fancydata.length > 0 && logs.length > 0) {
            for (var fanc of fancydata) {
               let exist = await activefancy.findOne({ "eventId": fanc.eventId, "runnerId": fanc.runnerId })
               if (exist) {
                  await activefancy.updateOne({ "eventId": fanc.eventId, "runnerId": fanc.runnerId }, { $set: fanc })
               } else {
                  let updateFancy =new activefancy(fanc);
                  updateFancy.save();
               }
            }
            for (var log of logs) {
               let exist = await mlogs.findOne({ "eventId": log.eventId, "selectionId": log.selectionId })
               if (exist) {
                  await mlogs.updateOne({ "eventId": log.eventId, "selectionId": log.selectionId }, { $set: log })
               } else {
                  let updatelog = new mlogs(log);
                  updatelog.save();
               }
            }
         }
         resolve("successfully added");
      } catch (err) {
         reject(err);
      }
   });
};
adminService.getFancyByData = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {

         let result = await activefancy.find(reqBody).lean();
         resolve(result);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.setFancyData = async (Obj) => {
   return new Promise(async (resolve, reject) => {
      try {

         let activityLog = {
            eventId: Obj.eventId,
            type1: "Fancy",
            type2: Obj.provider,
            value: Obj.status,
            result: Obj.name,
            selectionId: Obj.selectionId,
            createdBy: Obj.createdBy,
            createdAt: new Date().toISOString(),
         };
         let exist = await activefancy.findOne({ eventId: Obj.eventId, selectionId: Obj.selectionId });
         if (exist) {
            await activefancy.updateOne(
               { eventId: Obj.eventId, selectionId: Obj.selectionId },
               { $set: Obj }
            );
         } else {
            let fs= new activefancy(Obj);
            fs.save();
         }
         await matchLogsService.addMatchLogs(activityLog);
         resolve("success");
      } catch (err) {
         reject(err);
      }
   });
};
adminService.getActiveFancies = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {

         let result = await activefancy.find({ eventId: reqBody.eventId, active: reqBody.activeStatus }).lean();
         resolve(result);
      } catch (err) {
         console.log("err", err);
         reject(err);
      }
   });
};
adminService.updateRemove = async (reqBody, removed) => {
   return new Promise(async (resolve, reject) => {
      try {
         let updateFancy = await activefancy.updateOne(
               { eventId: reqBody["eventId"], sid: reqBody.sid },
               { $set: { removed: removed } }
            );
         resolve(updateFancy);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.getActiveFancyByevent = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
     try {
      //  let client = await backenddb();
       let result1 = await activefancy.find({ eventId: reqBody.eventId, status: "Active" }).lean();
       let match = await matchModel
         .findOne({ eventId: reqBody.eventId });
       // console.log("match",match);
       var fancyProvider = match.fancyProvider;
       let result = await redisdb.GetRedis(
         "Fancy-" + match.marketId + "-" + match.fancyProvider
       );
       let finalResult = [{ result: result, result1: result1 }];
       for (var results of finalResult) {
         // console.log("re",results);
         let fancc = [];
         if (results.result != null && results.result != "null") {
           if (fancyProvider == "diamond") {
             fancc = JSON.parse(results.result);
             const t3 = fancc.data.t3 || [];
             const t4 = [];
             fancc = [...t3, ...t4];
             // console.log("fancc",fancc);
           } else if (
             fancyProvider == "virtual" ||
             fancyProvider == "jdiamond"
           ) {
             fancc = JSON.parse(results.result);
             const t3 = fancc.t3 || [];
             fancc = [...t3];
           } else {
             fancc = JSON.parse(results.result);
             fancc = fancc;
           }
         }
 
         if (fancc.length > 0) {
           if (results.result1.length) {
             if (fancyProvider == "diamond") {
               // console.log(reqBody.eventId, fancc, results.result1);
               OtherAutoFancies(reqBody.eventId, fancc, results.result1).then(
                 (result2) => {
                   let response = {
                     message: "Fancy Fetched!",
                     eventId: reqBody.eventId,
                     provider: fancyProvider,
                     result: result2,
                   };
                   resolve(response);
                 }
               );
             } else if (
               fancyProvider == "virtual" ||
               fancyProvider == "jdiamond"
             ) {
               OtherAutoFancies(reqBody.eventId, fancc, results.result1).then(
                 (result2) => {
                   let response = {
                     message: "Fancy Fetched!",
                     eventId: reqBody.eventId,
                     provider: fancyProvider,
                     result: result2,
                   };
                   resolve(response);
                 }
               );
             } else if (fancyProvider == "sky") {
               SkyFancies(reqBody.eventId, fancc, results.result1).then(
                 (result2) => {
                   let response = {
                     message: "Fancy Fetched!",
                     eventId: reqBody.eventId,
                     provider: fancyProvider,
                     result: result2,
                   };
                   resolve(response);
                 }
               );
             } else if (fancyProvider == "sk") {
               SkFancies(reqBody.eventId, fancc, results.result1).then(
                 (result2) => {
                   let response = {
                     message: "Fancy Fetched!",
                     eventId: reqBody.eventId,
                     provider: fancyProvider,
                     result: result2,
                   };
                   resolve(response);
                 }
               );
             } else if (fancyProvider == "tiger") {
               TigerFancies(reqBody.eventId, fancc, results.result1).then(
                 (result2) => {
                   let response = {
                     message: "Fancy Fetched!",
                     eventId: reqBody.eventId,
                     provider: fancyProvider,
                     result: result2,
                   };
                   resolve(response);
                 }
               );
             } else {
               NeerajFancies(reqBody.eventId, fancc, results.result1).then(
                 (result2) => {
                   let response = {
                     message: "Fancy Fetched!",
                     eventId: reqBody.eventId,
                     provider: fancyProvider,
                     result: result2,
                   };
                   resolve(response);
                 }
               );
             }
           } else {
             let response = {
               message: "No Active Fancy!",
               result: [],
             };
             resolve(response);
           }
         } else {
           let response = {
             message: "No Fancy!",
             result: [],
           };
 
           resolve(response);
         }
       }
     } catch (err) {
       console.log("err", err);
       reject(err);
     }
   });
 };
 let OtherAutoFancies = async (event, array1, array2) => {
   return array1.filter((o) =>
     array2.some(({ selectionId }) => {
       return makeFancy(event, o.sid) === selectionId;
     })
   );
 };
 
 let SkyFancies = async (event, array1, array2) => {
   return array1.filter((o) =>
     array2.some(({ selectionId }) => {
       return makeFancy(event, o.marketId) === selectionId;
     })
   );
 };
 
 let SkFancies = async (event, array1, array2) => {
   return array1.filter((o) =>
     array2.some(({ selectionId }) => {
       return makeFancy(event, o.sky_fancy_id) === selectionId;
     })
   );
 };
 let NeerajFancies = async (event, array1, array2) => {
   return array1.filter((o) =>
     array2.some(({ selectionId }) => {
       return makeFancy(event, o.SelectionId) === selectionId;
     })
   );
 };
 
 let TigerFancies = async (event, array1, array2) => {
   return array1.filter((o) =>
     array2.some(({ selectionId }) => {
       return makeFancy(event, o.id) === selectionId;
     })
   );
 };
 
 function makeFancy(event, runner) {
   return event + "-" + runner + ".FY";
 }
//  adminService.insertMatchLogs = async (matchLogs) => {
//    return new Promise(async (resolve, reject) => {
//      try {
//        let client = await backenddb();
//        let logs = await client
//          .collection("MatchLogs")
//          .insertMany(matchLogs, { ordered: false });
//        resolve(logs);
//      } catch (err) {
//        reject(err);
//      }
//    });
//  };
 

module.exports = adminService;