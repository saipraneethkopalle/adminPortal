const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const match = require("../models/match");
const dmatch = require("../models/dMatches");
const mlogs = require("../models/matchLogs");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const moment = require("moment");
const settings = require("../models/settings");
function adminService() { }
adminService.removeMatchById = async (event_id) => {
   return new Promise(async (resolve, reject) => {
      try {  
         let data = await match.deleteOne({eventId:event_id});
         let dellog = {
            eventId: event_id, type1: 'Match', type2: 'Other', value: 'Del', result: 'Other', createdBy: 'API Selling', createdAt: (new Date()).toISOString()
         }
         let dlog = new mlogs(dellog);
         dlog.save();
         resolve("");
      } catch (err) {
         reject(err);
      }
   });
};
adminService.addMatch = async (md) => {
   return new Promise(async (resolve, reject) => {
      try {
         let eventData;
         let createdBy = md.createdBy;
         let exist = match.find({ eventId: md.eventId }).lean();         
         if (exist.length > 0) {
         delete md.createdBy;
            eventData = match
               .updateOne({ eventId: md.eventId }, { $set: md });
         } else {
            eventData = new match(md);
            eventData.save();
            let data = {
               eventId: md.eventId,
               type1: "Match",
               type2: "Other",
               value: "Add",
               result: "Other",
               createdBy: createdBy,
               createdAt: new Date(),
            };
            let logs=new mlogs(data);
            logs.save();
         }
         resolve(eventData);
      } catch (err) {
         reject(err);
      }
   });
};

// adminService.updateMatchStatus = async (event_id, match_status) => {
//    return new Promise(async (resolve, reject) => {
//       try {
         
//          let data = client.collection("Matches")
//             .findOneAndUpdate(
//                { "Event Id": event_id },
//                { $set: { Status: match_status } }
//             );
//          resolve(data);
//       } catch (err) {
//          reject(err);
//       }
//    });
// };

adminService.insertMatchData = async (matches) => {
   return new Promise(async (resolve, reject) => {
      try {
         
         let fil = (await settings.find().lean())[0];
         let cricketData = [];
         let tennisData = [];
         let soccerData = [];
         matches.filter((m) => {
            if (m.sportId == "4") {
               cricketData.push(m);
            } else if (m.sportId == "1") {
               soccerData.push(m);
            } else {
               tennisData.push(m);
            }
         });
         let mdata = [];
         // console.log("i am printing the cricket data",cricketData)
         if (fil.cricket == 'auto') {

            mdata.push(...cricketData)
         } if (fil.tennis == 'auto') {
            mdata.push(...tennisData)

         } if (fil.soccer == 'auto') {
            mdata.push(...soccerData)

         }
         // console.log("md",mdata.length);
         let newMatches = [];
         for (let events of mdata) {
            let exist = await match
               .findOne({ eventId: events.eventId });
               // console.log("check",exist);
            if (exist == null) {
               newMatches.push(events);
            }
         }
         // console.log("new",newMatches.length);
         if (newMatches.length > 0) {
            await match.insertMany(newMatches, { ordered: false });
         }
         resolve(newMatches);
      } catch (err) {
         // console.log("err",err);
         reject(err);
      }
   });
};
adminService.getEventsData = async () => {
   return new Promise(async (resolve, reject) => {
      try {         
         let eventData =await match.find().sort({'openDate':-1}).limit(1000).lean().exec();
         // console.log("eventData",eventData)
         eventData = eventData.sort((a, b) => moment(b.openDate) - moment(a.openDate)); 
         resolve(eventData);
      } catch (err) {
         console.log(err)
         reject(err);
      }
   });
};
adminService.getEventDataBySportName = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {
         // console.log("reqBody",reqBody);         
         let data = match.find(reqBody).lean();
         // console.log(" i am printing the data",data)
         resolve(data);
      } catch (err) {
         reject(err);
      }
   });
};

adminService.updateEventProvider = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {
         
         let createdBy = reqBody.createdBy;
         // delete reqBody.createdBy;
         // console.log("i am printing reqbody here", reqBody);
         let data = match.updateOne({ eventId: reqBody.eventId }, { $set: reqBody });
         let matchLog = {
            type1: "Match",
            result: "Other",
            createdBy: createdBy,
            eventId: reqBody.eventId,
         };
         if (reqBody.oddsProvider) {
            matchLog.type2 = "Odds";
            matchLog.value = reqBody.oddsProvider;
         } else if (reqBody.fancyProvider) {
            matchLog.type2 = "Fancy";
            matchLog.value = reqBody.fancyProvider;
         } else if (reqBody.bmProvider) {
            matchLog.type2 = "BM";
            matchLog.value = reqBody.bmProvider;
         } else if (reqBody.fancyAType) {
            matchLog.type2 = "Fancy A Type";
            matchLog.value = reqBody.fancyAType;
         } else {
            matchLog.type2 = "Add Type";
            matchLog.value = reqBody.addType;
         }
         matchLog.createdAt = new Date();
         let lg= mlogs(matchLog);
         lg.save();
         resolve(data);
      } catch (err) {
         reject(err);
      }
   });
};

adminService.getRemovedData = async (eventId, data) => {
   return new Promise(async (resolve, reject) => {
      try {
         
         let createdBy = data.createdBy;
         delete data.createdBy;
         let res;
         await match.updateOne({ eventId: eventId }, { $set: data });
         if (data.isActive) {
            res = {
               eventId: eventId,
               type1: "Match",
               type2: "RollBack",
               value: "None",
               result: "Other",
               createdBy: createdBy,
               createdAt: new Date(),
            };
         } else {
            res = {
               eventId: eventId,
               type1: "Match",
               type2: "Result",
               value: "None",
               result: "Other",
               createdBy: createdBy,
               createdAt: new Date(),
            };
         }

         let logs =new mlogs(res);
         logs.save();
         // let removedData = await redisdb.GetRedis("removedMatch");
         // removedData = JSON.parse(removedData);
         // let data = removedData.filter(eid=>{if(eid!=eventId)return eid;})
         // console.log(data)
         // await redisdb.SetRedis("removedMatch",JSON.stringify(data));
         resolve("success");
      } catch (err) {
         reject(err);
      }
   });
};
adminService.getEventById = async (eventId) => {
   return new Promise(async (resolve, reject) => {
      try {
         
         // let finalResult=[{"eventDetails":[],"fancyDetails":[]}];
         let event = await match.find({ eventId: eventId }).lean();

         // console.log("i am pprinting the data",event[0]["marketId"])
         // let fancyArr=[]
         // let fancyDetails = await client.collection('fancyDetails').find({marketId:event[0]["marketId"]}).toArray();
         // fancyArr.push(fancyDetails);
         resolve(event);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.updateMatchFinalStatus = async (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         
         let update;
         let exists = await match.findOne({ eventId: data.eventId });
         // console.log("event id is ",eventId)

         if (exists) {
            update = await match.updateOne({ eventId: data.eventId }, { $set: { isActive: true, isResult: false } });
            if (update.acknowledged) {
               resolve([{ isActive: true }]);
            }
         } else {
            data.isActive = true;
            data.isResult = false;
            let m=new match(data);
            m.save();
            let logdata = {
               eventId: data.eventId,
               type1: "Match",
               type2: "Other",
               value: "Add",
               result: "Other",
               createdBy: "admin",
               createdAt: new Date(),
            };
            let logs=new mlogs(logdata);
            logs.save();
            resolve([{ isActive: true }]);
         }
         // console.log("update is0",update)

         // console.log("updated data",update)
         // resolve(update)
      } catch (err) {
         reject(err);
      }
   });
};
adminService.updateEventUrl = async (reqBody) => {
   return new Promise(async (resolve, reject) => {
      try {
         
         let updateUrl = await match.updateOne(
               { eventId: reqBody.eventId },
               { $set: { channelNo: reqBody.channelNo } }
            );
         resolve(updateUrl);
      } catch (err) {
         reject(err);
      }
   });
};
adminService.getNewData = async (data) => {
   return new Promise(async (resolve, reject) => {
     try {
       let oddsProvider =
         JSON.parse(await redisdb.GetRedis("providers")) != null
           ? JSON.parse(await redisdb.GetRedis("providers")).odds
           : "betfair";
       let fancyProvider =
         JSON.parse(await redisdb.GetRedis("providers")) != null
           ? JSON.parse(await redisdb.GetRedis("providers")).fancy
           : "diamond";
       let bmProvider =
         JSON.parse(await redisdb.GetRedis("providers")) != null
           ? JSON.parse(await redisdb.GetRedis("providers")).bookmaker
           : "diamond";
       let matchdata;
       await axios
         .get("http://172.105.51.41:3000/v1-api/match/getScoreMatchesCP")
         .then(function (response) {
           // console.log("re",response)
           matchdata = response.data.result;
         })
         .catch((error) => {
           console.log("main", error);
         });
       let arr = [];
       let matchlist = matchdata.map((matchData) => ({
         eventId: matchData.event_id,
         eventName: matchData.event_name,
         marketId: matchData.market_id,
         marketName: matchData.market_name,
         competitionId: matchData.competition_id,
         competitionName: matchData.competition_name,
         sportId: matchData.sport_id,
         sportName: matchData.sport_name,
         matchRunners: JSON.parse(matchData.match_runners),
         oddsProvider,
         fancyProvider,
         bmProvider,
         openDate: matchData.open_date,
         type: "auto",
         markets: matchData.markets,
         marketIds: matchData.market_ids,
         mType: matchData.mType,
         mEventId: matchData.event_id,
         channelNo: "http://bettingsolutions.in/livetv/tvcode2.html",
       }));
       // console.log("count",match.length);
 
       for (let obj of matchlist) {
         if (obj.sportName == data) {
           let matchExist = await match.findOne({ eventId: obj.eventId });
           if (matchExist) {
             obj["isActive"] = true;
           } else {
             obj["isActive"] = false;
           }
           arr.push(obj);
         }
       }
       // console.log("ar",arr)
       resolve(arr);
     } catch (err) {
       console.log("err", err.message);
       reject(err);
     }
   });
 };
module.exports = adminService;