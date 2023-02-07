const Config = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const common = require("../utils/common");
const { uuid } = require("uuidv4");
const axios = require("axios");
const { response } = require("express");
const moment = require("moment");
const { match } = require("assert");
const { reject } = require("underscore");
const ObjectId = require("mongodb").ObjectId;

function adminService() {}
adminService.addWhitelistWebsite = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let dataExist = await client
        .collection("Websites")
        .findOne({ name: obj.name });
      if (dataExist) {
        resolve({ message: "Website Already exist." });
      } else {
        obj.website_id = uuid();
        let data = await client.collection("Websites").insertOne(obj);
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
      let client = await backenddb();
      let dataExist = await client
        .collection("Websites")
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
      let client = await backenddb();
      let dataExist = await client
        .collection("Websites")
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
      let client = await backenddb();
      let data = await client.collection("Websites").find().toArray();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.adduser = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      // console.log(obj.username)

      let dataExist = await client
        .collection("users")
        .findOne({ username: obj.username });
      if (dataExist) {
        resolve({ message: "User Already exist" });
      } else {
        obj.slag = obj.password;
        obj.password = await common.encryptPassword(obj.password);
        obj.level = 3;
        obj.isActive = true;
        let adduser = await client.collection("users").insertOne(obj);
        resolve(obj);
      }
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = await client.collection("users").find({ level: 3 }).toArray();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.updateUser = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let hashPassword = await common.encryptPassword(reqBody.password);
      let data = await client
        .collection("users")
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
// adminService.getLoginStatus = async (username) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let client = await backenddb();
//             let data = await client.collection("users").findOne({ username: username })
//             resolve(data);
//         } catch (err) {
//             reject(err);
//         }
//     })
// }
adminService.UpdateSettings = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let createdBy = reqBody.createdBy;
      delete reqBody.createdBy;
      // console.log(reqBody);
      await redisdb.SetRedis("providers", JSON.stringify(reqBody));
      await client.collection("Events").updateMany(
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
        oddsValue: reqBody.odds,
        fancyValue: reqBody.fancy,
        bmValue: reqBody.bookmaker,
        result: "Other",
        createdBy: createdBy,
        createdAt: new Date(),
      };
      await client.collection("MatchLogs").insertOne(data);
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
};

adminService.updateMatchStatus = async (event_id, match_status) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = client
        .collection("Matches")
        .findOneAndUpdate(
          { eventId: event_id },
          { $set: { Status: match_status } }
        );
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
      let db = await backenddb();
      let query = await db.collection("Websites").deleteOne({ name: name });
      resolve(query);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getMatches = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = await client.collection("Matches").find().toArray();
      data = data.sort((a, b) => {
        return new Date(a["Open Date"]) - new Date(b["Open Date"]);
      });
      resolve(data);
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
      let client = await backenddb();
      let match;
      await axios
        .get("http://172.105.51.41:3000/v1-api/match/getScoreMatchesCP")
        .then(function (response) {
          // console.log("re",response)
          match = response.data.result;
        })
        .catch((error) => {
          console.log("main", error);
        });
      let arr = [];
      let matchlist = match.map((matchData) => ({
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
          let matchExist = await client
            .collection("Events")
            .findOne({ eventId: obj.eventId });
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

adminService.getManualData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let manualData = await client
        .collection("Events")
        .find({ Source: "Manual" })
        .toArray();
      resolve(manualData);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getMatchBySports = async (sports) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = await client
        .collection("Matches")
        .find({ "Sport Name": sports })
        .toArray();
      // console.log(data);

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.removeMatchById = async (event_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = await client
        .collection("Events")
        .deleteOne({ eventId: event_id });
      let dellog={
          eventId:event_id, type1: 'Match', type2: 'Other', value: 'Del', result: 'Other', createdBy: 'API Selling',createdAt:(new Date()).toISOString()
      }
      await client.collection('MatchLogs').insertOne(dellog);
      resolve("");
    } catch (err) {
      reject(err);
    }
  });
};
adminService.addMatch = async (md) => {
  return new Promise(async (resolve, reject) => {
    try {
      let createdBy = md.createdBy;
      delete md.createdBy;
      let client = await backenddb();
      let exist = await client
        .collection("Events")
        .findOne({ eventId: md.eventId });
      if (exist) {
        eventData = await client
          .collection("Events")
          .updateOne({ eventId: md.eventId }, { $set: md });
      } else {
        eventData = await client.collection("Events").insertOne(md);
        let data = {
          eventId: md.eventId,
          type1: "Match",
          type2: "Other",
          value: "Add",
          result: "Other",
          createdBy: createdBy,
          createdAt: new Date(),
        };
        await client.collection("MatchLogs").insertOne(data);
      }
      resolve(eventData);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.updateMatchStatus = async (event_id, match_status) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = client
        .collection("Matches")
        .findOneAndUpdate(
          { "Event Id": event_id },
          { $set: { Status: match_status } }
        );
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.insertMatchData = async (matches) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let fil = await client.collection("matchSettings").findOne();
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
      let mdata=[];
      // console.log("i am printing the cricket data",cricketData)
      if(fil.cricket=='auto'){
  
        mdata.push(...cricketData)
      }if(fil.tennis=='auto') {
        mdata.push(...tennisData)
        
      }if(fil.soccer=='auto') {
        mdata.push(...soccerData)

      }
      let newMatches = [];
      for (let events of mdata) {
        let exist = await client
          .collection("Events")
          .findOne({ eventId: events.eventId });
        if (exist == null) {
          newMatches.push(events);
        }
      }
      if (newMatches.length > 0) {
        await client
          .collection("Events")
          .insertMany(newMatches, { ordered: false });
      }
      resolve(newMatches);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getEventsData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let eventData = await client.collection("Events").find().toArray();
      resolve(eventData);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getEventDataBySportName = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      // console.log("reqBody",reqBody);
      let data = await client.collection("Events").find(reqBody).toArray();
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
      let client = await backenddb();
      let createdBy = reqBody.createdBy;
      delete reqBody.createdBy;
      // console.log("i am printing reqbody here", reqBody);
      let data = await client
        .collection("Events")
        .updateOne({ eventId: reqBody.eventId }, { $set: reqBody });
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
      } else if (reqBody.activeType) {
        matchLog.type2 = "Fancy A Type";
        matchLog.value = reqBody.activeType;
      } else {
        matchLog.type2 = "Add Type";
        matchLog.value = reqBody.mType;
      }
      matchLog.createdAt = new Date();
      await client.collection("MatchLogs").insertOne(matchLog);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getRemovedData = async (eventId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let createdBy = data.createdBy;
      delete data.createdBy;
      let res;
      await client
        .collection("Events")
        .updateOne({ eventId: eventId }, { $set: data });
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

      await client.collection("MatchLogs").insertOne(res);
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
      let client = await backenddb();
      // let finalResult=[{"eventDetails":[],"fancyDetails":[]}];
      let event = await client
        .collection("Events")
        .find({ eventId: eventId })
        .toArray();

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
      let client = await backenddb();
      let update;
      let exists = await client
        .collection("Events")
        .findOne({ eventId: data.eventId });
      // console.log("event id is ",eventId)

      if (exists) {
        update = await client
          .collection("Events")
          .updateOne({ eventId: data.eventId }, { $set: { isActive: true,isResult:false } });
        if (update.acknowledged) {
          resolve([{ isActive: true }]);
        }
      } else {
        data.isActive = true;
        data.isResult = false;
        await client.collection("Events").insertOne(data);
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
      let client = await backenddb();
      let updateUrl = await client
        .collection("Events")
        .updateOne(
          { eventId: reqBody.eventId },
          { $set: { channelNo: reqBody.channelNo } }
        );
      resolve(updateUrl);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.addSetLimitData = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let exist = await client
        .collection("SetLimitDetails")
        .findOne({ eventId: reqBody.eventId });
      if (exist) {
        let obj = reqBody;
        let eventId = obj.eventId;
        delete obj.eventId;
        let updateSetLimit = await client
          .collection("SetLimitDetails")
          .updateOne({ eventId: eventId }, { $set: reqBody });
      } else {
        let addSetlimit = await client
          .collection("SetLimitDetails")
          .insertOne(reqBody);
      }
      resolve("Success");
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getSetLimitById = async (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = await client
        .collection("SetLimitDetails")
        .find({ eventId: eventId })
        .toArray();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getFancy = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let data = await client.collection("fancyDetails").find().toArray();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.updateFancy = async (marketId, sid, obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let updateFancy = await client
        .collection("fancyDetails")
        .updateOne({ "Market Id": marketId, sid: sid }, { $set: obj });
      resolve(updateFancy);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.updateMarkStatus = async (reqBody, markStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let exist = await client
        .collection("fancyDetails")
        .findOne({ eventId: reqBody["eventId"], sid: reqBody.sid });
      if (exist) {
        let updateFancy = await client
          .collection("fancyDetails")
          .updateOne(
            { eventId: reqBody["eventId"], sid: reqBody.sid },
            { $set: { active: markStatus } }
          );
      } else {
        reqBody.active = markStatus;
        await client.collection("fancyDetails").insertOne(reqBody);
      }
      let result = await client
        .collection("fancyDetails")
        .find({ eventId: reqBody["eventId"], active: markStatus })
        .toArray();

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.updateClosing = async (reqBody, closed) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let doc = await client
        .collection("fancyDetails")
        .findOne({ eventId: reqBody["eventid"], runnerId: reqBody.id });
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
      await adminService.addMatchLogs(activityLog);
      let updateFancy = await client
        .collection("fancyDetails")
        .updateOne(
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
      let client = await backenddb();

      let updateFancy = await client
        .collection("fancyDetails")
        .updateOne(
          { eventId: reqBody["eventId"], selectionId: reqBody.id },
          { $set: { status: "Active", result: "" } }
        );
      resolve(updateFancy);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.insertAll = async (fancy, logs) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      if(fancy.length > 0 && logs.length > 0){  
      for(var fanc of fancy){
       let exist = await client.collection("fancyDetails").findOne({"eventId":fanc.eventId,"runnerId":fanc.runnerId})
       if(exist){
        await client.collection("fancyDetails").updateOne({"eventId":fanc.eventId,"runnerId":fanc.runnerId},{$set:fanc})
       }else{
       let updateFancy = await client
       .collection("fancyDetails")
       .insertOne(fanc);
       }
      }        
      for(var log of logs){
        let exist = await client.collection("MatchLogs").findOne({"eventId":log.eventId,"selectionId":log.selectionId})
        if(exist){
         await client.collection("MatchLogs").updateOne({"eventId":log.eventId,"selectionId":log.selectionId},{$set:log})
        }else{
        let updatelog = await client
        .collection("MatchLogs")
        .insertOne(log);
        }
       }
      }
      resolve("successfully added");
    } catch (err) {
      reject(err);
    }
  });
};
adminService.addOddsData = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let exist = await client
        .collection("oddsDetails")
        .findOne({ eIdProvider: reqBody.eventId + "-" + reqBody.provider });
      let obj = {
        eIdProvider: reqBody.eventId + "-" + reqBody.provider,
        eventId: reqBody.eventId,
        provider: reqBody.provider,
        data: JSON.stringify(reqBody.data),
      };
      if (exist) {
        await client
          .collection("oddsDetails")
          .updateOne(
            { eIdProvider: reqBody.eventId + "-" + reqBody.provider },
            { $set: obj }
          );
      } else {
        obj.active = 1;
        await client.collection("oddsDetails").insertOne(obj);
      }
      resolve(reqBody);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getFancyByData = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let result = await client
        .collection("fancyDetails")
        .find(reqBody)
        .toArray();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.setFancyData = async (Obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
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
      let exist = await client
        .collection("fancyDetails")
        .findOne({ eventId: Obj.eventId, selectionId: Obj.selectionId });
      if (exist) {
        await client
          .collection("fancyDetails")
          .updateOne(
            { eventId: Obj.eventId, selectionId: Obj.selectionId },
            { $set: Obj }
          );
      } else {
        await client.collection("fancyDetails").insertOne(Obj);
      }
      await adminService.addMatchLogs(activityLog);
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
};
            

adminService.addOddsData = async(reqBody)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let client = await backenddb();
            let exist = await client.collection("oddsDetails").findOne({eIdProvider:reqBody.eventId +'-'+reqBody.provider})
            let obj = {eIdProvider:reqBody.eventId +'-'+reqBody.provider,eventId:reqBody.eventId,provider:reqBody.provider,data:JSON.stringify(reqBody.data)}
            if(exist){
                await client.collection('oddsDetails').updateOne({eIdProvider:reqBody.eventId +'-'+reqBody.provider},{$set:obj})
            }else{
                obj.active = 1
                await client.collection('oddsDetails').insertOne(obj)
            }
            resolve(reqBody);
        }catch(err){
            reject(err);
        }
    })
}
adminService.getMatchActivities= async(query,type)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            let finalResult;
            let client = await backenddb();
            let result =  await client.collection('MatchLogs').find(query).toArray()
            let result2 = await client.collection('MatchLogs').find({eventId:'9'}).toArray();
            // console.log("type is ",type)
            if(type=='') {
              finalResult = [...result,...result2]
            }else {
              finalResult = result;
            }
            //  finalResult = [...result,...result2]
            finalResult = finalResult.sort((a,b)=>moment(b.createdAt) -moment(a.createdAt));
            resolve(finalResult)
          }catch(err) {
            reject(err)
          }
        });
      }


adminService.addOddsData = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let exist = await client
        .collection("oddsDetails")
        .findOne({ eIdProvider: reqBody.eventId + "-" + reqBody.provider });
      let obj = {
        eIdProvider: reqBody.eventId + "-" + reqBody.provider,
        eventId: reqBody.eventId,
        provider: reqBody.provider,
        data: JSON.stringify(reqBody.data),
      };
      if (exist) {
        await client
          .collection("oddsDetails")
          .updateOne(
            { eIdProvider: reqBody.eventId + "-" + reqBody.provider },
            { $set: obj }
          );
      } else {
        obj.active = 1;
        await client.collection("oddsDetails").insertOne(obj);
      }
      resolve(reqBody);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getMatchActivities = async (query, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      let finalResult;
      let client = await backenddb();
      let result = await client.collection("MatchLogs").find(query).toArray();
      let result2 = await client
        .collection("MatchLogs")
        .find({ eventId: "9" })
        .toArray();
      // console.log("type is ",type)
      if (type == "") {
        finalResult = [...result, ...result2];
      } else {
        finalResult = result;
      }
      //  finalResult = [...result,...result2]
      finalResult = finalResult.sort(
        (a, b) => moment(b.createdAt) - moment(a.createdAt)
      );
      resolve(finalResult);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getFancyByData = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let result = await client
        .collection("fancyDetails")
        .find(reqBody)
        .toArray();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.setFancyData = async (Obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
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
      let exist = await client
        .collection("fancyDetails")
        .findOne({ eventId: Obj.eventId, selectionId: Obj.selectionId });
      if (exist) {
        await client
          .collection("fancyDetails")
          .updateOne(
            { eventId: Obj.eventId, selectionId: Obj.selectionId },
            { $set: Obj }
          );
      } else {
        await client.collection("fancyDetails").insertOne(Obj);
      }
      await adminService.addMatchLogs(activityLog);
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
};

adminService.getActiveFancies = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let result = await client
        .collection("fancyDetails")
        .find({ eventId: reqBody.eventId, active: reqBody.activeStatus })
        .toArray();
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
      let client = await backenddb();

      let updateFancy = await client
        .collection("fancyDetails")
        .updateOne(
          { eventId: reqBody["eventId"], sid: reqBody.sid },
          { $set: { removed: removed } }
        );
      resolve(updateFancy);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.updateMatch = async (closedEvents) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let updateEvents = await client
        .collection("Events")
        .updateMany(
          { eventId: { $in: closedEvents } },
          { $set: { isResult: true } }
        );
      resolve("updated successfully", updateEvents);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getFancyActivity = async (match) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let activities = await client
        .collection("MatchLogs")
        .find(match)
        .toArray();
      activities = activities.sort(
        (a, b) => moment(b.createdAt) - moment(a.createdAt)
      );
      resolve(activities);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.addMatchLogs = async (matchLogs) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      matchLogs.createdAt = new Date().toISOString();
      let activityLog = await client
        .collection("MatchLogs")
        .findOne({
          eventId: matchLogs.eventId,
          selectionId: matchLogs.selectionId,
          value: matchLogs.value,
        });
      if (activityLog) {
        await client
          .collection("MatchLogs")
          .updateOne(
            {
              eventId: matchLogs.eventId,
              selectionId: matchLogs.selectionId,
              value: matchLogs.value,
            },
            { $set: matchLogs }
          );
      } else {
        await client.collection("MatchLogs").insertOne(matchLogs);
      }
      resolve(matchLogs);
    } catch (err) {
      reject(err);
    }
  });
};
adminService.getActiveFancyByevent = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let result1 = await client
        .collection("fancyDetails")
        .find({ eventId: reqBody.eventId, status: "Active" })
        .toArray();
      let match = await client
        .collection("Events")
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
adminService.insertMatchLogs = async (matchLogs) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await backenddb();
      let logs = await client
        .collection("MatchLogs")
        .insertMany(matchLogs, { ordered: false });
      resolve(logs);
    } catch (err) {
      reject(err);
    }
  });
};

adminService.updateSettings = async(reqBody) =>{
  return new Promise(async (resolve,rejct)=>{
    try {
      let client = await backenddb();
      await client.collection('matchSettings').updateOne({},{$set:{
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
      let client = await backenddb();
      let result = await client.collection("matchSettings").find().toArray();
      resolve(result)

    } catch(err) {
      reject(err)

    }
  })
}
module.exports = adminService;
