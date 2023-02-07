const redisdb = require("../constants/redis-db");
const backenddb = require("../constants/db");
const constants = require("../constants/CONST");
const mongoose = require("mongoose");
const match = require("../models/match");
const logsModels = require("../models/matchLogs");
const matchService = require("../services/matchService");
const matchLogsService = require("../services/matchLogsService");
const Raxios = require('axios');
const axios = Raxios.create({
    timeout: 2000,
});
const moment = require('moment');
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');
const config= {headers:{
  Authorization: "Bearer BekarHaiMutualFunds",
}
};
process.on('uncaughtException', (err) => {
    process.exit(1);
});

// Adding matches from external api in db
const addAllMatches =async()=>{
    try {
        let oddsProvider = JSON.parse(await redisdb.GetRedis('providers'))!= null ? JSON.parse(await redisdb.GetRedis('providers')).odds:'betfair';
        let fancyProvider = JSON.parse(await redisdb.GetRedis('providers'))!= null ? JSON.parse(await redisdb.GetRedis('providers')).fancy:'diamond';
        let bmProvider = JSON.parse(await redisdb.GetRedis('providers'))!= null ? JSON.parse(await redisdb.GetRedis('providers')).bookmaker:'diamond';    
        const { data: { result } } = await axios.get('http://172.105.51.41:3000/v1-api/match/getScoreMatchesCP');
        const matches = result.map(matchData => ({
            eventId: matchData.event_id, eventName: matchData.event_name,
            marketId: matchData.market_id, marketName: matchData.market_name, competitionId: matchData.competition_id,
            competitionName: matchData.competition_name, sportId: matchData.sport_id,
            sportName: matchData.sport_name, matchRunners: JSON.parse(matchData.match_runners), oddsProvider,
            fancyProvider, bmProvider, openDate: matchData.open_date, type: 'auto', markets: matchData.markets,
            marketIds: matchData.market_ids, mType: matchData.mType, mEventId: matchData.event_id,
            channelNo: "http://bettingsolutions.in/livetv/tvcode2.html", isActive: true, isResult: false
        }));
        // console.log("match",matches);
        // const rec = await match.insertMany(matches, { ordered: false });
        const rec = await matchService.insertMatchData(matches);
        const insEevnt = rec.map(dt => ({
            eventId: dt.eventId, type1: 'Match', type2: 'Other', value: 'Add', result: 'Other', createdBy: 'API Selling'
        }));
        // console.log(insEevnt.length, 'Logs Inserted');
        await logsModels.insertMany(insEevnt);
  
        return { status: 1, data: "Successfully Stored" };
      } catch (err) {
        // console.log(err);
        return { status: 0, error: err.message };
      }
}

// fetching active matches and odd matches from db and OddMatches and storing in redis
const getActiveMatches =async()=>{
    try{
        // let client = await backenddb();
        let activeDate = moment().add(240,'m').unix()
        let getMatchlist = await match.find({"isActive":true,"isResult":false}).lean()
        let cricket = getMatchlist.filter(cr=>{if(cr.sportId == '4'){return cr;}})
        let otherMatches = getMatchlist.filter(other=>{
            let openDate = moment(other.openDate, "MM/DD/YYYY HH:mm:ss A").unix()
            if(other.sportId!='4' && openDate <=activeDate){return other;}
        })
        let activeMatches = [...cricket,...otherMatches];
        let OddMatches = activeMatches.filter(aMatches=>{if(constants.defaultOddValues.includes(aMatches.oddsProvider) || constants.type.includes(aMatches.type)){return aMatches;}})
        let OddSktMatches = activeMatches.filter(aMatches=>{if(constants.type.includes(aMatches.type)){return aMatches;}})        
        let fancyMatches = activeMatches.filter(aMatches=>{if(aMatches.sportId == '4' && constants.type.includes(aMatches['type'])){
            // aMatches['FinalStatus']=true;
            return aMatches;}})
        let virtualMatches = activeMatches.filter(aMatches=>{if(aMatches.sportId == '4' && aMatches.sportId.startsWith('100')){return aMatches;}}) 
        
        // console.log("Matches",activeMatches.length,OddMatches.length,OddSktMatches.length,fancyMatches.length,virtualMatches.length);
        await redisdb.SetRedis("ActiveMatches",JSON.stringify(activeMatches));
        await redisdb.SetRedis("OddMatches",JSON.stringify(OddMatches));
        await redisdb.SetRedis("OddSktMatches",JSON.stringify(OddSktMatches));
        await redisdb.SetRedis("fancyMatches",JSON.stringify(fancyMatches));
        await redisdb.SetRedis("virtualMatches",JSON.stringify(virtualMatches));
        return { status: 1, data: activeMatches }
    }catch(err){
        return { status: 0, error: err.message };
    }
}
const autoRemove = async () => {
    try {
        const currentUnix = moment().unix();
        const matches = JSON.parse(await redisdb.GetRedis('ActiveMatches')) != null ? JSON.parse(await redisdb.GetRedis('ActiveMatches')):[];
        const test = matches.filter(dt => dt.sportId != '4' && !dt.marketName.includes('Winner'));
        // console.log(test);
        console.log("all",matches.length);
        let st = matches.filter(dt => dt.sportId != '4' && !dt.marketName.includes('Winner')).map(mt => {
            return { ...mt, expireUnix: moment(mt.openDate, "MM/DD/YYYY HH:mm:ss A").add(480, 'm').unix() };
        }).filter(mtch => mtch.expireUnix < currentUnix);    
        const mt = matches.filter(dt => dt.sportId == '4' && dt.matchRunners.length==2).map(ct => {
            console.log("days",moment().diff(moment(ct.openDate),'days'),"date",ct.openDate,ct.eventId)
            return ct;
          }).filter(mtch =>moment().diff(moment(mtch.openDate),'days') >= 1);
          const t = matches.filter(dt => dt.sportId == '4' && dt.matchRunners.length >=3).map(tt => {
            console.log("days2",moment().diff(moment(tt.openDate),'days'),"date",tt.openDate,tt.eventId)
              return tt;
          }).filter(mtch =>moment().diff(moment(mtch.openDate),'days') >= 6);
          st = [...st,...mt,...t]

        let closedEvents = st.map(dt => (dt.eventId));
        // console.log("$$$$$$$$closedEvents",closedEvents)
        const deleted = await match.updateMany(
            { eventId: { $in: closedEvents } },
            { $set: { isResult: true } }
          );
 
    //    console.log("deleted is",del)
    
    }
    catch (err) {
        console.log(err);
    }
}
// store odds data in redis based on market ids along with provider for every 500 milli sec 
const getOddsData = async(market_ids)=>{
    try{
        let oddsData =await axios.get('http://172.105.51.41:3000/v1-api/odds/getBOdds?marketId=' + market_ids.toString()) 
        oddsData =oddsData.data  
        Object.keys(oddsData).forEach(function (key){
            // console.log("rediskey",'Odds-' + key + '-betfair');            
            oddsData[key].betfair && redisdb.SetRedisEx('Odds-' + key + '-betfair', JSON.stringify(oddsData[key].betfair), 2)
            oddsData[key].tiger && redisdb.SetRedisEx('Odds-' + key + '-tiger', JSON.stringify(oddsData[key].tiger), 2)
            oddsData[key].ryan && redisdb.SetRedisEx('Odds-' + key + '-ryan', JSON.stringify(oddsData[key].ryan), 2)
        });
        
        return { status: 1, data: oddsData }
    }catch(err){
        return { status: 0, error: err.message };
    }
}
const matchInterval = setIntervalAsync(async () => {
     addAllMatches();
    autoRemove();
},1000 * 60 * 5);

const activeInterval = setIntervalAsync(async () => {
    getActiveMatches();
},1000 * 10);

const oddsInterval = setIntervalAsync(async () => {
    try {
        const oddsdata = await redisdb.GetRedis('OddMatches');
        if (oddsdata) {
            const oddsMarketIds = JSON.parse(oddsdata).map(match => (match.marketIds));
            const chunk = oddsSplitArray(oddsMarketIds, 20);
            for (const element of chunk) {
                element.length && getOddsData(element);
            }
        }
    }
    catch (err) {
        // console.log("err2",err);
    }
}, 350);

const getFancyData = async (marketIds) => {
    try {
        let fancyData = await axios.get('http://172.105.51.41:3000/v1-api/fancy/getDSFO?marketId=' + marketIds.toString());        
        fancyData = fancyData.data;
        Object.keys(fancyData).forEach(function (key) {
            // console.log(key + '-diamond');
            fancyData[key].diamond && redisdb.SetRedisEx('Fancy-' + key + '-diamond', fancyData[key].diamond, 3)
            fancyData[key].skyf && redisdb.SetRedisEx('Fancy-' + key + '-sky', fancyData[key].skyf, 3)
            fancyData[key].skyo && redisdb.SetRedisEx('Odds-' + key + '-sky', fancyData[key].skyo, 3)
            fancyData[key].skyb && redisdb.SetRedisEx('BM-' + key + '-sky', fancyData[key].skyb, 3)            
        });
    }
    catch (err) {
        // console.log("here is",err);
    }
}
const getSky2Fancy = async (marketIds) => {
    try {
        let skyFancyData =await axios.get('http://172.105.51.41:3000/v1-api/fancy/getSky2?marketId=' + marketIds.toString())
        skyFancyData = skyFancyData.data;
        Object.keys(skyFancyData).forEach(function (key) {
            // console.log('Fancy-' + key + '-sky2');
            skyFancyData[key].sky2 && redisdb.SetRedisEx('Fancy-' + key + '-sky2', skyFancyData[key].sky2, 4)
            skyFancyData[key].sky3 && redisdb.SetRedisEx('Fancy-' + key + '-sk', skyFancyData[key].sky3, 4)
            skyFancyData[key].sky3b && redisdb.SetRedisEx('BM-' + key + '-sk', skyFancyData[key].sky3b, 4)
            skyFancyData[key].john && redisdb.SetRedisEx('Fancy-' + key + '-jdiamond', skyFancyData[key].john, 4)
            skyFancyData[key].tiger && redisdb.SetRedisEx('Fancy-' + key + '-tiger', skyFancyData[key].tiger, 4)
            skyFancyData[key].tigerb && redisdb.SetRedisEx('BM-' + key + '-tiger', skyFancyData[key].tigerb, 4)
            skyFancyData[key].tigerr && redisdb.SetRedisEx('Result-' + key + '-tiger', skyFancyData[key].tigerr, 4)
        });
    }
    catch (err) {
        // console.log(err);
    }
}

setIntervalAsync(async () => {
    try {
        const fancymatches = await redisdb.GetRedis('fancyMatches');
        if (fancymatches) {
            const fancyMarketIds = JSON.parse(fancymatches).map(match => (match.marketId));
            const chunk = chunkArray(fancyMarketIds, 20);
            for (const element of chunk) {
                element.length && getFancyData(element);
            }
        }
    }
    catch (err) {
        // console.log("err1",err);
    }
}, 350);
setIntervalAsync(async () => {
    try {
        const fancymatches = await redisdb.GetRedis('fancyMatches');
        if (fancymatches) {
            const fancyMarketIds = JSON.parse(fancymatches).map(match => (match.marketId));
            const chunk = chunkArray(fancyMarketIds, 10);
            for (const element of chunk) {
                element.length && getSky2Fancy(element);
            }
        }
    }
    catch (err) {
        // console.log("err1",err);
    }
}, 350);
const chunkArray = (myArray, size) => {
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, size));
    }
    return results;
}
const oddsSplitArray = (myArray, size) => {
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, size));
    }
    return results;
}

addAllMatches();
autoRemove();
getActiveMatches();
