const { STATUS } = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const common = require("../utils/common");
const adminService = require("../services/adminService");
const moment = require("moment");
const CONST = require("../constants/CONST");
const userService = require("../services/userService");
const whiteListService = require("../services/whiteListService");
const oddsService = require("../services/oddsService");
const fancyService = require("../services/fancyService");
const matchLogsService = require("../services/matchLogsService");
const matchService = require("../services/matchService");
const matchLogs = require("../models/matchLogs");
const activeFancy = require("../models/activeFancy");
exports.addWhitelistWebsite = async (req, res) => {
  try {
    let obj = req.body;
    let addWebsite = await whiteListService.addWhitelistWebsite(obj);
    return res.status(STATUS.OK).send(addWebsite);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getWhitelistWebsite = async (req, res) => {
  try {
    let website_id = req.params.website_id;
    let getWebsiteData = await whiteListService.getWebsiteData(website_id);
    return res.status(STATUS.OK).send(getWebsiteData);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getAllWebsite = async (req, res) => {
  try {
    let userData = await whiteListService.getAllWebsite();
    return res.status(STATUS.OK).send(userData);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.removeWhitelistWebsite = async (req, res) => {
  try {
    let website_id = req.params.website_id;
    let getWebsiteData = await whiteListService.removeWhitelistData(website_id);
    return res.status(STATUS.OK).send(getWebsiteData);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.removeWebsite = async (req, res) => {
  try {
    // console.log(req.params);
    let deleteWebsite = await whiteListService.removeWebsite(req.params.name);
    return res.status(STATUS.OK).send({ status: 1, data: deleteWebsite });
  } catch (err) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send({ status: 0, error: err.message });
  }
};
exports.adduser = async (req, res) => {
  try {
    let userDetails = req.body;
    // console.log(userDetails);
    let result = await userService.adduser(userDetails);
    return res.status(STATUS.OK).send(result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getUsers = async (req, res) => {
  try {
    let userData = await userService.getUsers();
    return res.status(STATUS.OK).send(userData);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.updateUser = async (req, res) => {
  try {
    let updateUser = await userService.updateUser(req.body);
    return res.status(STATUS.OK).send(updateUser);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getLoginStatus = async (req, res) => {
  try {
    let username = req.body.username;
    let loginDetail = await adminService.getLoginStatus(username);
    return res.status(STATUS.OK).send(loginDetail);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.addDefaultSettings = async (req, res) => {
  try {
    let finalResult = await userService.UpdateSettings(req.body);
    return res.status(STATUS.OK).send({ message: "success" });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getDefaultSettings = async (req, res) => {
  try {
    let finalResult = JSON.parse(await redisdb.GetRedis("providers"));
    finalResult = finalResult != null ? [finalResult] : [{ odds: "betfair", fancy: 'diamond', bookmaker: 'diamond' }]
    return res.status(STATUS.OK).send(finalResult);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.addMatch = async (req, res) => {
  try {
    let matchRunners = req.body.matchRunners;
    // console.log("i am printing the data here ",matchRunners)
    if(req.body.matchType != "Test") {
      matchRunners.pop();
    }
   req.body.matchRunners = matchRunners.map((data) => ({
      selectionId: Math.floor(100000 + Math.random() * 900000),
      name: data,
    }));

    req.body.openDate = moment(req.body.openDate).format("MM/DD/YYYY hh:mm:ss A");
    req.body.oddsProvider = CONST.defaultOddValues[1];
    req.body.fancyProvider = CONST.defaultFancyValues[1];
    req.body.isActive = true;
    req.body.isResult = false;
    // console.log("i am printing the match",req.body.matchRunners)
    let result = await matchService.addMatch(req.body);
    return res.status(STATUS.OK).send(result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getLatestData = async (req, res) => {
  try {
    let Result = await matchService.getNewData(req.params.sports);

    return res.status(STATUS.OK).send(Result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.updateMatchStatus = async (req, res) => {
  try {
    var event_id = req.body.event_id;
    var match_status = req.body.match_status;
    let matchlist = JSON.parse(
      await redisdb.GetRedis(JSON.stringify(event_id))
    );

    if (matchlist.eventId == event_id) {
      matchlist["type"] = match_status;
    }

    await redisdb.SetRedis(JSON.stringify(event_id), JSON.stringify(matchlist));
    return res.status(STATUS.OK).send(matchlist);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getMatches = async (req, res) => {
  try {
    let matchData = await adminService.getMatches();

    return res.status(STATUS.OK).send({ status: 1, data: matchData });
  } catch (err) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send({ status: 0, error: err.message });
  }
};

exports.getMatchBySports = async (req, res) => {
  try {
    // console.log(req.params.sports);
    let matchData = await adminService.getMatchBySports(req.params.sports);

    return res.status(STATUS.OK).send({ status: 1, data: matchData });
  } catch (err) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send({ status: 0, error: err.message });
  }
};

exports.removeMatch = async (req, res) => {
  try {
    let removeMatch = await matchService.removeMatchById(req.params.event_id);
    return res.status(STATUS.OK).send({ message: "Removed Successfully" });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.fetchMatches = async (req, res) => {
  try {
    let matchList = JSON.parse(await redisdb.GetRedis("ActiveMatches"));
    return res.status(STATUS.OK).send({ "matches": matchList});
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
}
exports.getEvents = async (req, res) => {
  try {
    let eventData = await matchService.getEventsData();
    return res.status(STATUS.OK).send(eventData);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};

exports.getEventsBySportName = async (req, res) => {
  try {
    // await redisdb.DelRedis("removedMatch")
    let finalResult = await matchService.getEventDataBySportName(req.body);
    finalResult = finalResult.map(dt => ({ ...dt, unixDate: moment(dt.openDate, 'MM/DD/YYYY hh:mm:ss A').unix() })).sort((a, b) => a.unixDate - b.unixDate);

    return res.status(STATUS.OK).send(finalResult);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.removeMatchFromRedis = async (req, res) => {
  try {
    let re = await matchService.getRemovedData(req.params.eventId,req.body)
  
    // let updateMatch = await adminService.
    // console.log(req.params.eventId);
    // let re = await redisdb.GetRedis("removedMatch");
    // let removedEvents;
    // if (re == null) {
    //   removedEvents = [];
    // } else {
    //   removedEvents = JSON.parse(re);
    // }
    // removedEvents.push(req.params.eventId);
    // await redisdb.SetRedis("removedMatch", JSON.stringify(removedEvents));
    // // let getData = await redisdb.GetRedis(req.params.sport);
    // let getData = await redisdb.GetRedis("removedMatch");
    // console.log(JSON.parse(getData));

    return res.status(STATUS.OK).send({ message: "Success" });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
};
exports.rollBack = async (req, res) => {
  try {
    // console.log(req.params);
    let data = await matchService.getRemovedData(req.params.eventId, req.body);
    return res.status(STATUS.OK).send({ message: "success" });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
};
exports.updateProvider = async (req, res) => {
  try {
    // console.log("i am here to print the error")
    let finalResult = await matchService.updateEventProvider(req.body);
    return res.status(STATUS.OK).send(finalResult);
  } catch (err) {
    console.log("error is ",err.message)
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};

exports.getRemovedData = async (req, res) => {
  try {
    let removedData = [];
    let finalResult = await matchService.getEventsData();
    // let newRemovedList = JSON.parse(await redisdb.GetRedis("removedMatch"));
    // if (newRemovedList != null) {
    //   removedData = newRemovedList;
    // }
    // finalResult = finalResult.filter((fl) => {
    //   if (removedData.includes(fl.eventId)) return fl;
    // });
    return res.status(STATUS.OK).send(finalResult);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getRemovedDataBySName = async (req, res) => {
  try {
    let removedData = [];
    // console.log(req.params.sport);
    let finalResult = await matchService.getEventsData();
    let newRemovedList = JSON.parse(await redisdb.GetRedis("removedMatch"));
    if (newRemovedList != null) {
      removedData = newRemovedList;
    }
    finalResult = finalResult.filter((fl) => {
      if (removedData.includes(fl.eventId) && fl.sportName == req.params.sport) return fl;
    });

    return res.status(STATUS.OK).send(finalResult);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};

exports.updateUrl = async (req, res) => {
  try {
    let updateUrl = await matchService.updateEventUrl(req.body);
    return res.status(STATUS.OK).send(updateUrl);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
};

exports.addSetLimit = async (req, res) => {
  try {
    let addData = await adminService.addSetLimitData(req.body);
    return res.status(STATUS.OK).send({ message: "Successfully added" });
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
};
exports.getSetLimit = async (req, res) => {
  try {
    let getData = await adminService.getSetLimitById(req.params.eventId);
    return res.status(STATUS.OK).send(getData);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
};

exports.getLayBackDetails = async (req, res) => {
  try {
    let getData = await redisdb.GetRedis("layback");
    getData = JSON.parse(getData);
    let mid = req.body.marketIds;
    let eventData = req.body.eventData;
    let provider = req.body.provider;
    let backdata = [];
    let laydata = [];
    // console.log("testing",getData);
    let data = getData.filter((el) => {
      var m = Object.keys(el)[0];
      if (mid.includes(m)) {
        if (provider == "betfair" && el[m]["betfair"] != null) {
          el[m]["betfair"].filter((e) => {
            e["runners"].filter((se) => {
              backdata.push({
                selectionId: se.selectionId,
                backArray: se.ex.availableToBack[0],
              });
              laydata.push({
                selectionId: se.selectionId,
                layArray: se.ex.availableToLay[0],
              });
            });
          });
        }
        if (provider == "tiger" && el[m]["tiger"] != null) {
          el[m]["tiger"].filter((e) => {
            e["runners"].filter((se) => {
              backdata.push({
                selectionId: se.selectionId,
                backArray: se.ex.availableToBack[0],
              });
              laydata.push({
                selectionId: se.selectionId,
                layArray: se.ex.availableToLay[0],
              });
            });


          });
        }
        if (provider == "ryan" && el[m]["ryan"] != null) {
          el[m]["ryan"].filter((e) => {
            e["runners"].filter((se) => {
              backdata.push({
                selectionId: se.selectionId,
                backArray: se.ex.availableToBack[0],
              });
              laydata.push({
                selectionId: se.selectionId,
                layArray: se.ex.availableToLay[0],
              });
            });


          });
        }
      }
    });
    if (backdata.length > 0 && laydata.length > 0) {
      eventData = eventData.filter((sd) => {
        let backar = backdata.find((fd) => {
          if (fd.selectionId == sd.selectionId) {
            return fd;
          }
        }).backArray;
        let layarr = laydata.find((fd) => {
          if (fd.selectionId == sd.selectionId) {
            return fd;
          }

        }).layArray;

        sd["backprice"] = backar.price;
        sd["backsize"] = backar.size;
        sd["layprice"] = layarr.price;
        sd["laysize"] = layarr.size;
        return sd;
      });
    }
    return res.status(STATUS.OK).send(eventData);
  } catch (err) {
    console.log(err.message);
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
};


exports.getEventDetail = async (req, res) => {
  try {
    // console.log("dsfvds", req.params.eventId);
    let data = await matchService.getEventById(req.params.eventId);
    return res.status(STATUS.OK).send(data);

  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}

exports.updateFinalStatus = async (req, res) => {
  try {
    // console.log(req.body);
    let updateStatus = await matchService.updateMatchFinalStatus(req.body)
    // console.log("i am printing update status inside controller", updateStatus)
    return res.status(STATUS.OK).send(updateStatus)

  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message)
  }
}

exports.removeFancy = async (req, res) => {
  try {
    
    let updateStatus = await fancyService.updateMarkStatus(req.body.data[0], false)
    return res.status(STATUS.OK).send(updateStatus)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.getInactiveFancy = async (req, res) => {
  try {
    let removeList = JSON.parse(await redisdb.GetRedis("RemoveList"));
    return res.status(STATUS.OK).send(removeList)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.activeFancy = async (req, res) => {
  try {
   
    let updateStatus = await fancyService.updateMarkStatus(req.body.data[0], true)
    // let removeList = JSON.parse(await redisdb.GetRedis("RemoveList"));
    return res.status(STATUS.OK).send(updateStatus);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.closeFancy = async (req, res) => {
  try {
    let updateStatus = await fancyService.updateClosing(req.body, true)
    return res.status(STATUS.OK).send(updateStatus)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.changeactiveAll = async (req, res) => {
  try {
    let updateStatus = await fancyService.insertAll(req.body.data,req.body.logs)
   
    return res.status(STATUS.OK).send({"message":"successfully added"})
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.fetchOdds = async (req, res) => {
  try {
    let oddsData = JSON.parse(await redisdb.GetRedis("Odds:"));
    oddsData = oddsData.find(od => (od.marketId == req.params.marketId))
    return res.status(STATUS.OK).send(oddsData)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.addOdds = async (req, res) => {
  try {
    let oddsResult = await oddsService.addOddsData(req.body)
    return res.status(STATUS.CREATED).send(oddsResult)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.getMatchesActivities = async (req,res)=>{
  try {
    // console.log("i am printing the req");
    const { type } = req.query;
    let params = { eventId: req.params.eventId };
    if (type != '') {
        params = { ...params, value: type };
    }
    let result = await matchLogsService.getMatchActivities(params,type);
    return res.status(STATUS.OK).send(result);

  } catch(err) {
    console.log(err)
    return res.status(STATUS.BAD_REQUEST).send(err.message)
  }
}
exports.getFancyByStatus = async (req, res) => {
  try {
    // console.log("req.query",req.query);
    let Result = await fancyService.getFancyByData(req.query);
    return res.status(STATUS.OK).send(Result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err.message);
  }
}
exports.getFancy = async (req, res) => {
  try {
    const match = JSON.parse(await redisdb.GetRedis('ActiveMatches')) || [];
    const mData = match.filter(data => { return data.eventId == req.params.eventId })[0] || {};
    if (mData) {
      const provider = mData.fancyProvider;
      const eventP = mData.marketId + '-' + provider;
      let result = await redisdb.GetRedis('Fancy-' + eventP);
      if (result != null && result != 'null') {
        if (provider == 'diamond') {
          const data = JSON.parse(result);
          const t3 = data.data.t3 || [];
          const t4 = [];
          const allFancy = [...t3, ...t4];
          if (allFancy) {
            let resultnew = JSON.stringify(allFancy);
            let nresult = { eventP: eventP, eventId: req.params.eventId, provider: provider, data: resultnew };
            res.status(200).json({
              message: 'Fancy Fetched!',
              result: nresult,
              status: 1
            });
          }
          else {
            res.status(200).json({
              message: 'Not Found!',
              result: [],
              status: 0
            });
          }
        }
        else if (provider == 'virtual' || provider == 'jdiamond') {
          const data = JSON.parse(result);
          const t3 = data.t3 || [];
          const allFancy = [...t3];
          if (allFancy) {
            let resultnew = JSON.stringify(allFancy);
            let nresult = { eventP: eventP, eventId: req.params.eventId, provider: provider, data: resultnew };
            res.status(200).json({
              message: 'Fancy Fetched!',
              result: nresult,
              status: 1
            });
          }
          else {
            res.status(200).json({
              message: 'Not Found!',
              result: [],
              status: 0
            });
          }
        }
        else if (provider == 'sky' || provider == 'betfair' || provider == 'sk' || provider == 'tiger') {
          let nresult = { eventP: eventP, eventId: req.params.eventId, provider: provider, data: result };
          res.status(200).json({
            message: 'Fancy Fetched!',
            result: nresult,
            status: 1
          });
        }
        else {
          res.status(200).json({
            message: 'Not Found!',
            result: [],
            status: 0
          });
        }
      }
      else {
        res.status(200).json({
          message: 'Not Found!',
          result: [],
          status: 0
        });
      }

    }
    else {
      res.status(200).json({
        message: 'Match Not Found!',
        result: [],
        status: 0
      });
    }
  }
  catch (err) {
    res.status(500).json({ message: err._message });
  }
}

exports.setFancyStatus = async (req, res) => {
  try{
  let Obj = {
    eventId: req.body.eventId,
    selectionId: req.body.selectionId,
    runnerId: req.body.runnerId,
    name: req.body.name,
    status: req.body.status,
    provider: req.body.provider,
    type: req.body.type,
    createdBy:req.body.createdBy
  }
  // console.log("Obj",Obj);
  let result = await fancyService.setFancyData(Obj);
  return res.status(STATUS.OK).send(Obj);
} catch (err) {
  return res.status(STATUS.BAD_REQUEST).send(err.message);
}

}
exports.getProviderFancy = async (req, res, next) => {
  try {
      const result = await redisdb.GetRedis('Fancy-' + req.query.marketId + '-' + req.query.provider);
      // console.log("res",result);
      if (result != null && result != 'null') {
          res.status(STATUS.OK).send({
              message: 'Data Found!',
              result: { data: result },
              status: 1
          });
      }
      else {
          res.status(STATUS.OK).send({
              message: 'Data Not Found!',
              result: { data: null },
              status: 0
          });
      }
  }
  catch (err) {
      res.status(STATUS.BAD_REQUEST).send({ message: err._message });
  }
}
exports.getAllActiveData = async(req,res)=>{
  try{
    // console.log("body",req.body);
    let Result = await fancyService.getActiveFancies(req.body);
    return res.status(STATUS.OK).send(Result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
}
exports.removeFancyData = async(req,res)=>{
  try{
  let Result = await fancyService.updateRemove(req.body,true);
  return res.status(STATUS.OK).send(Result);
} catch (err) {
  return res.status(STATUS.BAD_REQUEST).send(err);
}
}
exports.rollbackFancy = async(req,res)=>{
  try{
    let Result = await fancyService.updateRollback(req.body);
    return res.status(STATUS.OK).send(Result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};
exports.getFancyActivities = async(req,res)=>{
  try{
    // console.log("req is ",req.params)
    let Result = await matchLogsService.getFancyActivity(req.params);
    return res.status(STATUS.OK).send(Result);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
}
exports.getActiveFancyByEvent = async (req, res) => {
  try{
    let Result = await fancyService.getActiveFancyByevent(req.params);
    return res.status(STATUS.OK).send(Result);
  }catch(err){
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
}
exports.getOdds = async (req, res) => {
  try {
      const match = JSON.parse(await redisdb.GetRedis('ActiveMatches')) || [];
      // console.log("match",match);
      const mData = match.filter(data => { return data.eventId == req.params.eventid })[0] || {};
      if (mData) {
          const provider = mData.oddsProvider;
          if (provider == 'betfair' || provider == 'ryan' || provider == 'tiger') {
              const betfair = await getBO([mData.marketId], provider);
              return res.status(STATUS.OK).send({
                  message: 'Odds Fetched!',
                  result: {
                      eventP: req.params.eventid + "-" + provider,
                      eventId: req.params.eventid,
                      type: "Odds",
                      provider: provider,
                      data: JSON.stringify(betfair)
                  },
                  status: 1
              });
          }
          let fetch = (provider == 'diamond' || provider == 'world') ? 'Fancy' : 'Odds';
          const result = await redisdb.GetRedis(fetch + '-' + mData.marketId + '-' + provider);
          if (result != 'null' && result != null) {
              if (provider == 'world') {
                  const ods = JSON.parse(result).find(od => od.gtype == 'match')?.section || [];
                  return res.status(STATUS.OK).send({
                      message: 'Odds Fetched!',
                      result: {
                          eventP: req.params.eventid + "-" + provider,
                          eventId: req.params.eventid,
                          type: "Odds",
                          provider: provider,
                          data: JSON.stringify(ods)
                      },
                      status: 1
                  });
              }
              res.status(STATUS.OK).send({
                  message: 'Odds Fetched!',
                  result: {
                      eventP: req.params.eventid + "-" + provider,
                      eventId: req.params.eventid,
                      type: "Odds",
                      provider: provider,
                      data: result
                  },
                  status: 1
              });
          }
          else {
              res.status(STATUS.OK).send({
                  message: 'Not Found!',
                  result: [],
                  status: 0
              });
          }
      }
      else {
          res.status(STATUS.OK).send({
              message: 'Match Not Exists!',
              result: [],
              status: 0
          });
      }
  }
  catch (err) {
      res.status(STATUS.BAD_REQUEST).send({ message: err.message });
  }
}

exports.getMultiOdds = async (req, res) => {
  try {
      const match = JSON.parse(await redisdb.GetRedis('ActiveMatches')) || [];
      const mData = match.filter(data => { return data.eventId == req.params.eventid })[0] || {};
      if (mData) {
          const provider = mData.oddsProvider;
          if (provider == 'betfair' || provider == 'ryan' || provider == 'tiger') {
              const markets = mData.marketIds.filter(mt => mt != mData.marketId);
              const odds = await Promise.allSettled(markets.map(dt => redisdb.GetRedis('Odds-' + dt + '-' + provider)));
              const betfair = odds.map((res) => JSON.parse(res.value) || []).flat(1);
              return res.status(STATUS.OK).send({
                  message: 'Odds Fetched!',
                  result: {
                      eventP: req.params.eventid + "-" + provider,
                      eventId: req.params.eventid,
                      type: "Odds",
                      provider: provider,
                      data: JSON.stringify(betfair)
                  },
                  status: 1
              });
          }
          else {
              res.status(STATUS.OK).send({
                  message: 'Not Found!',
                  result: [],
                  status: 0
              });
          }
      }
      else {
          res.status(STATUS.OK).send({
              message: 'Match Not Exists!',
              result: [],
              status: 0
          });
      }
  }
  catch (err) {
      res.status(STATUS.BAD_REQUEST).send({ message: err.message });
  }
}

exports.getBookM = async (req, res) => {
  try {
      const match = JSON.parse(await redisdb.GetRedis('ActiveMatches')) || [];
      const mData = match.find(data => { return data.marketId == req.params.marketId }) || '';
      if (!mData) {
          return res.status(STATUS.OK).send({
              message: 'Match Not Exists!',
              result: [],
              status: 0
          });
      }

      const provider = mData.bmProvider;
      let fetch = (provider == 'diamond' || provider == 'jdiamond' || provider == 'virtual' || provider == 'world' || provider == 'bull') ? 'Fancy' : 'BM';
      const result = await redisdb.GetRedis(fetch + '-' + mData.marketId + '-' + provider);
      if (result != 'null' && result != null) {
          let results = JSON.parse(result);
          let bm;
          if (provider == 'diamond') {
              bm = results.data.t2 ? results.data.t2 : [];
          }
          else if (provider == 'virtual' || provider == 'jdiamond') {
              bm = results.t2 ? results.t2 : [];
          }
          else if (provider == 'world') {
              bm = [results.find(data => data.gtype == 'match1')] || [];
          }
          else if (provider == 'bull') {
              bm = results?.bookmakers?.bookmakers || [];
          }
          else if (provider == 'tiger') {
              bm = results || [];
          }
          else {
              bm = [results]
          }

          res.status(STATUS.OK).send({
              message: 'BookMaker Fetched!',
              result: bm,
              provider,
              status: 1
          });
      }
      else {
          res.status(STATUS.OK).send({
              message: 'Not Found!',
              result: [],
              provider,
              status: 0
          });
      }
  }
  catch (err) {
      res.status(STATUS.BAD_REQUEST).send({ message: err.message });
  }
}
const getBO = async (match, provider) => {
  let resp = [];
  for (const marketId of match) {
      const resp1 = await redisdb.GetRedis('Odds-' + marketId + '-' + provider);
      if (resp1) {
          resp = [...resp, ...JSON.parse(resp1)];
      }
      await setImmediatePromise();
  }
  return resp;
}
const setImmediatePromise = () => {
  return new Promise((resolve) => {
      setImmediate(() => resolve());
  });
}
exports.setProcess = async (req, res) => {
  try {
      let { type, data } = req.body;
      await redisdb.SetRedis('process', type, JSON.stringify(data));
      return res.status(STATUS.OK).send({
          message: 'Success',
          status: 1
      });
  }
  catch (err) {
      return res.status(STATUS.BAD_REQUEST).send({
          message: 'Failed',
          status: 0
      });
  }
}

exports.getProcess = async (req, res) => {
  try {
      let processData = JSON.parse(await redisdb.GetRedis('process'));
      return res.status(STATUS.OK).send({
          message: 'Success',
          data: processData,
          status: 1
      });
  }
  catch (err) {
      return res.status(STATUS.BAD_REQUEST).send({
          message: 'Failed',
          status: 0
      });
  }
}
exports.updateMatchSettings = async(req,res) =>{
  try {
    console.log("i am printing the req.body",req.body)
    let updateSettings = await userService.settingsData(req.body);
    return res.status(STATUS.OK).send({status:1,message:"Success"})

  } catch(err) {
    return res.status(STATUS.BAD_REQUEST).send(err)

  }

}

exports.getMatchSettings = async(req,res) => {
  try{
    let data = await userService.matchSettings();
    return res.status(STATUS.OK).send(data);

  } catch(err) {
    return res.status(STATUS.BAD_REQUEST).send(err);

  }
}
exports.setAutoFancy = async (data) => {
  let activeFancyData = {
      eventId: data.eventId,
      selectionId: data.selectionId,
      runnerId: data.runnerId,
      provider: data.provider,
      name: data.name,
      status: 'Active',      
      type: data.type
  };

  let mlogs = new matchLogs({
      eventId: data.eventId,
      type1: 'Fancy',
      type2: data.provider,
      value: 'Active',
      result: data.name,
      selectionId: data.selectionId,
      createdBy: 'Auto'
  });
  // await activeFancy.updateOne(
  //     { eventId: data.eventId, provider: data.provider, runnerId: data.runnerId },
  //     { $setOnInsert: activeFancyData },
  //     { upsert: true }
  // );
  let exist = await activeFancy.find({ eventId: data.eventId, provider: data.provider, runnerId: data.runnerId }).lean()
  // console.log("data",data);
  if(exist.length > 0){
    // console.log("autofancy",exist.length);
    await activeFancy.updateOne(
      { eventId: data.eventId, provider: data.provider, runnerId: data.runnerId },
      { $setOnInsert: activeFancyData },
      { upsert: true }
  );
  }else{
    // console.log("inserting",exist.length);
  let afancy = new activeFancy(activeFancyData);
  afancy.save();
  }
  await mlogs.save();
  return true;
}
