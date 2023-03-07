const redisdb = require("../constants/redis-db");
const constants = require("../constants/CONST");
const db = require("../constants/db");
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');
const activeFancy = require("../models/activeFancy");
const io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });

process.on('uncaughtException', (err) => {
    process.exit(1);
});
const capitalize = (provider) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
}
const getOdds = async (oddsProvider, eventId, marketId, matchRunners) => { 
    try{ 
        let type = oddsProvider == 'world' ? 'Fancy' : 'Odds'; 
    let oddsData = JSON.parse(await redisdb.GetRedis(type + '-' + marketId + '-' + oddsProvider));
    // console.log("odds",marketId,oddsData);
    if (oddsData == "null" || oddsData == null) {
        oddsData = [];
    }
    else {
        oddsData = oddsProvider == 'world' ? [oddsData.find(od => od.gtype == 'match')] || [] :oddsData;    
    }
    const val2 = { data: oddsData, Type: capitalize(oddsProvider), matchRunners: matchRunners };
    io.to('room-Event/Auto/' + eventId).emit('Event/Auto/' + eventId, val2);
    }catch(err){
        console.log("err",err);
    }
}
const getDiamondOdds = async (oddsProvider, eventId, marketId, matchRunners) => { 
    try{  
    let diamondData = JSON.parse(await redisdb.GetRedis('Fancy' + '-' + marketId + '-' + oddsProvider));
    if(diamondData == "null" || diamondData == null){
        diamondData = [];
    }
    else {
        diamondData = diamondData.data.t1 ? diamondData.data.t1[0] : [];
    }
    const val2 = { data: diamondData, Type: capitalize(oddsProvider), matchRunners: matchRunners };
    io.to('room-Event/Auto/' + eventId).emit('Event/Auto/' + eventId, val2);
    }catch(err){
        console.log("err",err);
    }
}

const getMOdds = async (eventId, marketId, marketIds, provider) => {
    const markets = marketIds.filter(mt => mt != marketId);
    const odds = await Promise.allSettled(markets.map(dt => redisdb.GetRedis('Odds-' + dt + '-' + provider)));
    const mOddsData = odds.map((res) => JSON.parse(res.value) || []).flat(1);
    const val2 = { data: mOddsData, Type: capitalize(provider) };
    io.to('room-MEvent/Auto/' + eventId).emit('MEvent/Auto/' + eventId, val2);
}
const OddsMInterval = setIntervalAsync(async () => {
    try {
        const keys = [redisdb.GetRedis('OddMatches'), redisdb.GetRedis('ODDS_MUL_ROOMS')];
        const [allMatch, liveMatch] = (await Promise.allSettled(keys)).map(ev => JSON.parse(ev.value));
        const tMatches = allMatch.filter(function (itm) {
            return liveMatch.indexOf(itm.eventId) > -1;
        });
        //console.log(tMatches.length);
        if (tMatches.length) {
            for (const element of tMatches) {
                constants.defaultOddValues.includes(element.oddsProvider) && getMOdds(element.eventId, element.marketId, element.marketIds, element.oddsProvider);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}, 500);
setIntervalAsync(async () => {
    try {
        const keys = [redisdb.GetRedis('OddSktMatches'), redisdb.GetRedis('ODDS_ROOMS')];
        const [allMatch, currentMatchs] = (await Promise.allSettled(keys)).map(ev => JSON.parse(ev.value));
        // console.log("keys",[allMatch, currentMatchs]);
        const Matches = allMatch.filter(function (itm) {
            return currentMatchs.indexOf(itm.eventId) > -1;
        });
        if (Matches.length) {
            for (const element of Matches) {
                element.oddsProvider == "diamond"?
                getDiamondOdds(element.oddsProvider, element.eventId, element.marketId, element.matchRunners):getOdds(element.oddsProvider, element.eventId, element.marketId, element.matchRunners)
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}, 200);

const getFancies = async (fancyProvider, eventId, marketId) => {
try{
const result = await redisdb.GetRedis('Fancy-' + marketId + '-' + fancyProvider);
    // let client = await backenddb();
    if (result != null && result != 'null') {
        let fancydata = JSON.parse(result);
        if (fancyProvider == 'diamond') {
            let t3 = fancydata.data.t3 || [];
            let t4 = fancydata.data.t4 || [];
            const allFancy = [...t3, ...t4];
            if (allFancy) {
                let result1=activeFancy.find({ eventId: eventId, status: 'Active', provider: fancyProvider }).lean()

                    if (result1.length) {
                        OtherAutoFancies(eventId, allFancy, result1).then(resp => {                            
                            let respon = { data: resp, Type: capitalize(fancyProvider) };
                            io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                        });
                    }
                    else {
                        let respon = { data: t3, Type: capitalize(fancyProvider) };
                        io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                    }
                
            }
            else {
                let respon = { data: t3, Type: capitalize(fancyProvider) };
                io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
            }
        }        
        else if (fancyProvider == 'sky') {
            let result1=await activeFancy.find({ eventId: eventId, status: 'Active', provider: fancyProvider }).lean();
                if (result1.length) {
                    SkyFancies(eventId, fancydata, result1).then(resp => {
                        let respon = { data: resp, Type: capitalize(fancyProvider) };
                        io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                    });
                }
                else {
                    let respon = { data: [], Type: capitalize(fancyProvider) };
                    io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                }
            
        }
        else if (fancyProvider == 'sk') {
            let result1=await activeFancy.find({ eventId: eventId, status: 'Active', provider: fancyProvider }).lean()
                if (result1.length) {
                    SkFancies(eventId, fancydata, result1).then(resp => {
                        let respon = { data: resp, Type: capitalize(fancyProvider) };
                        io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                    });
                }
                else {
                    let respon = { data: [], Type: capitalize(fancyProvider) };
                    io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                }
            
        }
        else if (fancyProvider == 'betfair') {
            let result1=await activeFancy.find({ eventId: eventId, status: 'Active', provider: fancyProvider }).lean();
                if (result1.length) {
                    betfairFancies(eventId, fancydata, result1).then(resp => {
                        let respon = { data: resp, Type: capitalize(fancyProvider) };
                        io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                    });
                }
                else {
                    let respon = { data: [], Type: capitalize(fancyProvider) };
                    io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                }            
        }        
        else if (fancyProvider == 'tiger') {
            let result1=await activeFancy.find({ eventId: eventId, status: 'Active', provider: fancyProvider }).lean();
                if (result1.length) {
                    BullFancies(eventId, fancydata, result1).then(resp => {
                        let respon = { data: resp, Type: capitalize(fancyProvider) };
                        io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, respon);
                    });
                }
                else {                    
                    let response = { data: [], Type: capitalize(fancyProvider) };
                    io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, response);
                }
            
        }
    }
    else {
        let response = { data: [], Type: capitalize(fancyProvider) };
        io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, response);
    }
}catch(err){
    // console.log(err.message);
    let response = { data: [], Type: capitalize(fancyProvider) };
    io.to('room-Fancy/Auto/' + eventId).emit('Fancy/Auto/' + eventId, response);
}
}

const getBookM = async (bmProvider, eventId, marketId) => {
    try{
    bmProvider = bmProvider =='sky3' ? 'sk':bmProvider
    const fetch = (bmProvider == 'diamond' || bmProvider == 'jdiamond' || bmProvider == 'virtual' || bmProvider == 'world' || bmProvider == 'bull' || bmProvider == 'tiger') ? 'Fancy-' + marketId + '-' + bmProvider : 'BM-' + marketId + '-' + bmProvider;
    const res = await redisdb.GetRedis(fetch);
    let resp = JSON.parse(res);
    if (resp == "null" || resp == null) {
        resp = [];
    }
    else {
        if (bmProvider == 'diamond') {
            resp = resp.data.t2 ? resp.data.t2 : [];
        }
        else if (bmProvider == 'virtual' || bmProvider == 'jdiamond') {
            resp = resp.t2 ? resp.t2 : [];
        }
        else if (bmProvider == 'world') {
            resp = [resp.find(od => od.gtype == 'match1')] || [];
        }
        else if (bmProvider == 'bull') {
            resp = resp?.bookmakers?.bookmakers || [];
        }
        else if (bmProvider == 'sk' || bmProvider == 'tiger') {
            resp = resp || [];
        }
        else {
            resp = [resp];
        }
    }

    const val2 = { data: resp, Type: capitalize(bmProvider) };
    io.to('room-BookM/Auto/' + eventId).emit('BookM/Auto/' + eventId, val2);
    }catch(err){
        console.log("berr",err);
    }
}
const FancyInterval = setIntervalAsync(async () => {
    try {
        const keys = [redisdb.GetRedis('fancyMatches'), redisdb.GetRedis('FANCY_ROOMS')];
        const [allMatch, liveMatch] = (await Promise.allSettled(keys)).map(ev => JSON.parse(ev.value) || []);
        const tMatches = allMatch.filter(function (itm) {
            return liveMatch.indexOf(itm.eventId) > -1;
        });

        if (tMatches.length) {
            for (const element of tMatches) {
                getFancies(element.fancyProvider, element.eventId, element.marketId);
                getBookM(element.bmProvider, element.eventId, element.marketId);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}, 500);
const OtherAutoFancies = async (event, array1, array2) => {
    return array1.filter(o => array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.sid) === selectionId;
        })).sort((a, b) => (a.sid > b.sid) ? 1 : -1);
}

const SkyFancies = async (event, array1, array2) => {
    return array1.filter(o => array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.marketId) === selectionId;
        }));
}

const SkFancies = async (event, array1, array2) => {
    return array1.filter(o => array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.sky_fancy_id) === selectionId;
        }));
}
const betfairFancies = async (event, array1, array2) => {
    return array1.filter(o => array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.SelectionId) === selectionId;
        }));
}

const makeFancy = (event, runner) => {
    return event + '-' + runner + '.FY';
}
