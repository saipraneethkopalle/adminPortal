const mongoose = require("../constants/db");
const fancyController = require('../controller/adminController');
const ActiveFancy = require("../models/activeFancy");
const redisdb = require("../constants/redis-db");
const CONST = require("../constants/CONST");

process.on('uncaughtException', (err) => {
    //console.log(err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${reason.message}`)
})

const setFancies = async (match) => {
    const result = await redisdb.GetRedis('Fancy-' + match.marketId + '-' + match.fancyProvider);
    // console.log("res",match.marketId,result);
    if (result != null && result != 'null') {
        let fancydata = JSON.parse(result);
        if (match.fancyProvider == 'diamond') {
            const t3 = fancydata.data.t3 || [];
            const t4 = []; //fancydata.data.t4 || [];
            const allFancy = [...t3, ...t4];
            if (allFancy) {
                const result1 = await ActiveFancy.find({ eventId: match.eventId, provider: match.fancyProvider }).select('_id selectionId');
                OtherAutoFancies(match.eventId, allFancy, result1).then(resp => {
                    setDiamondFancy(match.eventId, resp);
                });
            }
        }
        else if (match.fancyProvider == 'jdiamond') {
            const t3 = fancydata.t3 || [];
            const allFancy = [...t3];
            if (allFancy) {
                const result1 = await ActiveFancy.find({ eventId: match.eventId, provider: match.fancyProvider }).select('_id selectionId');
                OtherAutoFancies(match.eventId, allFancy, result1).then(resp => {
                    setJDiamondFancy(match.eventId, resp);
                });
            }
        }
        else if (match.fancyProvider == 'sky') {
            const result1 = await ActiveFancy.find({ eventId: match.eventId, provider: match.fancyProvider }).select('_id selectionId');
            SkyFancies(match.eventId, fancydata, result1).then(resp => {
                setSkyFancy(match.eventId, resp);
            });
        }
        else if (match.fancyProvider == 'sk') {
            const result1 = await ActiveFancy.find({ eventId: match.eventId, provider: match.fancyProvider }).select('_id selectionId');
            SkFancies(match.eventId, fancydata, result1).then(resp => {
                setSkFancy(match.eventId, resp);
            });
        }
        else if (match.fancyProvider == 'world') {
            const fc = fancydata.find(fw => fw.gtype == 'fancy')?.section || [];
            const result1 = await ActiveFancy.find({ eventId: match.eventId, provider: match.fancyProvider }).select('_id selectionId');
            OtherAutoFancies(match.eventId, fc, result1).then(resp => {
                setWorldFancy(match.eventId, resp);
            });
        }
        else if (match.fancyProvider == 'tiger') {
            const result1 = await ActiveFancy.find({ eventId: match.eventId, provider: match.fancyProvider }).select('_id selectionId');
            TigerFancies(match.eventId, fancydata, result1).then(resp => {
                setTigerFancy(match.eventId, resp);
            });
        }
    }
}

const FancyInterval = setInterval(async () => {
    const matches = JSON.parse(await redisdb.GetRedis("ActiveMatches")) || [];
    const dMatches = matches.filter((tMatch) => CONST.type.includes(tMatch.type) && tMatch.sportId == 4 && tMatch.fancyProvider == 'diamond' && tMatch.fancyAType == 'auto');
    const sMatches = matches.filter((tMatch) => CONST.type.includes(tMatch.type) && tMatch.sportId == 4 && tMatch.fancyProvider == 'sky' && tMatch.fancyAType == 'auto');
    const skMatches = matches.filter((tMatch) => CONST.type.includes(tMatch.type)  && tMatch.sportId == 4 && tMatch.fancyProvider == 'sk' && tMatch.fancyAType == 'auto');
    const wMatches = matches.filter((tMatch) => CONST.type.includes(tMatch.type)  && tMatch.sportId == 4 && tMatch.fancyProvider == 'world' && tMatch.fancyAType == 'auto');
    const tMatches = matches.filter((tMatch) => CONST.type.includes(tMatch.type)  && tMatch.sportId == 4 && tMatch.fancyProvider == 'tiger' && tMatch.fancyAType == 'auto');
    const jdMatches = matches.filter((tMatch) => CONST.type.includes(tMatch.type)  && tMatch.sportId == 4 && tMatch.fancyProvider == 'jdiamond' && tMatch.fancyAType == 'auto');
    const activeDKeys = (await redisdb.GetKeys("Fancy-*-diamond")).map(data => (data.split("-")[1]));
    const activeSKeys = (await redisdb.GetKeys("Fancy-*-sky")).map(data => (data.split("-")[1]));
    const activeSkKeys = (await redisdb.GetKeys("Fancy-*-sk")).map(data => (data.split("-").length > 3 ? "-" + data.split("-")[2] : data.split("-")[1]));
    const activeWKeys = (await redisdb.GetKeys("Fancy-*-world")).map(data => (data.split("-")[1]));
    const activeTKeys = (await redisdb.GetKeys("Fancy-*-tiger")).map(data => (data.split("-")[1]));
    const activeJDKeys = (await redisdb.GetKeys("Fancy-*-jdiamond")).map(data => (data.split("-")[1]));
    const inplayD = dMatches.filter(function (mch) {
        return activeDKeys.indexOf(mch.marketId) > -1;
    });

    const inplayS = sMatches.filter(function (mch) {
        return activeSKeys.indexOf(mch.marketId) > -1;
    });

    const inplaySk = skMatches.filter(function (mch) {
        return activeSkKeys.indexOf(mch.marketId) > -1;
    });

    const inplayW = wMatches.filter(function (mch) {
        return activeWKeys.indexOf(mch.marketId) > -1;
    });

    const inplayT = tMatches.filter(function (mch) {
        return activeTKeys.indexOf(mch.marketId) > -1;
    });

    const inplayJD = jdMatches.filter(function (mch) {
        return activeJDKeys.indexOf(mch.marketId) > -1;
    });

    const inplay = [...inplayD, ...inplayS, ...inplaySk, ...inplayW, ...inplayT, ...inplayJD];
    // const inplay = [...dMatches,...sMatches,...skMatches,...wMatches,...tMatches,...jdMatches]
    // console.log("p",inplay);
    inplay.forEach(element => {
        setFancies(element);
    });
}, 500);

let OtherAutoFancies = async (event, array1, array2) => {
    return array1.filter(o => !array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.sid) === selectionId;
        }));
}

let SkyFancies = async (event, array1, array2) => {
    return array1.filter(o => !array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.marketId) === selectionId;
        }));
}

let SkFancies = async (event, array1, array2) => {
    return array1.filter(o => !array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.sky_fancy_id) === selectionId;
        }));
}

let TigerFancies = async (event, array1, array2) => {
    return array1.filter(o => !array2.some(
        ({ selectionId }) => {
            return makeFancy(event, o.id) === selectionId;
        }));
}

let makeFancy = (event, runner) => {
    return event + '-' + runner + '.FY';
}

const setDiamondFancy = async (eventId, data) => {
    // console.log("d",eventId, data);
    const fancies = data.filter(resp => {
        return resp.ballsess != '3' && !resp.nat.includes('Bhav') && !resp.nat.includes('bhav') && !resp.nat.includes('.1') && !resp.nat.includes('.2') && !resp.nat.includes('.3') && !resp.nat.includes('.4') && !resp.nat.includes('.5') && !resp.nat.includes('.6'); // && !resp.nat.includes('total') && !resp.nat.includes('Top');  //  && !resp.nat.includes('Only')
    });
    fancies.forEach(data => {
        const aData = { eventId, selectionId: makeFancy(eventId, data.sid), runnerId: data.sid, provider: 'diamond', name: data.nat, type: data.gtype };
        fancyController.setAutoFancy(aData).then(resp => {
            console.log(resp, data.sid, 'diamond');
        });
    });
}

const setJDiamondFancy = async (eventId, data) => {
    const fancies = data.filter(resp => {
        return resp.ballsess != '3' && !resp.nat.includes('Bhav') && !resp.nat.includes('bhav') && !resp.nat.includes('.1') && !resp.nat.includes('.2') && !resp.nat.includes('.3') && !resp.nat.includes('.4') && !resp.nat.includes('.5') && !resp.nat.includes('.6'); // && !resp.nat.includes('total') && !resp.nat.includes('Top');  //  && !resp.nat.includes('Only')
    });
    fancies.forEach(data => {
        const aData = { eventId, selectionId: makeFancy(eventId, data.sid), runnerId: data.sid, provider: 'jdiamond', name: data.nat, type: 'Fancy' };
        fancyController.setAutoFancy(aData).then(resp => {
            console.log(resp, data.sid, 'jdiamond');
        });
    });
}

const setSkyFancy = async (eventId, data) => {
    const fancies = data.filter(dat => dat.status != '18' && dat.status != '1' && !dat.marketName.includes('Bhav') && !dat.marketName.includes('bhav') && !dat.marketName.includes('.1') && !dat.marketName.includes('.2') && !dat.marketName.includes('.3') && !dat.marketName.includes('.4') && !dat.marketName.includes('.5') && !dat.marketName.includes('.6'));  //&& !dat.marketName.includes('.') && !dat.marketName.includes('total') && !dat.marketName.includes('Top')); //&& !dat.marketName.includes('Only')
    fancies.forEach(data => {
        const aData = { eventId, selectionId: makeFancy(eventId, data.marketId), runnerId: data.marketId, provider: 'sky', name: data.marketName, type: 'Fancy' };
        fancyController.setAutoFancy(aData).then(resp => {
            console.log(resp, data.marketId, 'sky');
        });
    });
}

const setSkFancy = async (eventId, data) => {
    const fancies = data.filter(dat => !dat.runner_name.includes('Bhav') && !dat.runner_name.includes('bhav') && !dat.runner_name.includes('.1') && !dat.runner_name.includes('.2') && !dat.runner_name.includes('.3') && !dat.runner_name.includes('.4') && !dat.runner_name.includes('.5') && !dat.runner_name.includes('.6')); // && !dat.runner_name.includes('.') && !dat.runner_name.includes('total') && !dat.runner_name.includes('Top')); //&& !dat.runner_name.includes('Only')
    fancies.forEach(data => {
        const aData = { eventId, selectionId: makeFancy(eventId, data.sky_fancy_id), runnerId: data.sky_fancy_id, provider: 'sk', name: data.runner_name, type: 'Fancy' };
        fancyController.setAutoFancy(aData).then(resp => {
            console.log(resp, data.sky_fancy_id, 'sk');
        });
    });
}

const setWorldFancy = async (eventId, data) => {
    const fancies = data.filter(resp => !resp.nat.includes('Bhav') && !resp.nat.includes('bhav') && !resp.nat.includes('.1') && !resp.nat.includes('.2') && !resp.nat.includes('.3') && !resp.nat.includes('.4') && !resp.nat.includes('.5') && !resp.nat.includes('.6')); // && !resp.nat.includes('.') && !resp.nat.includes('total') && !resp.nat.includes('Top'));  //  && !resp.nat.includes('Only') 
    fancies.forEach(data => {
        const aData = { eventId, selectionId: makeFancy(eventId, data.sid), runnerId: data.sid, provider: 'world', name: data.nat, type: 'Fancy' };
        fancyController.setAutoFancy(aData).then(resp => {
            console.log(resp, data.sid, 'world');
        });
    });
}

const setTigerFancy = async (eventId, data) => {
    const fancies = data.filter(dat => !dat.name.includes('Bhav') && !dat.name.includes('bhav') && !dat.name.includes('.1') && !dat.name.includes('.2') && !dat.name.includes('.3') && !dat.name.includes('.4') && !dat.name.includes('.5') && !dat.name.includes('.6')); // && !dat.runner_name.includes('.') && !dat.runner_name.includes('total') && !dat.runner_name.includes('Top')); //&& !dat.runner_name.includes('Only')
    fancies.forEach(data => {
        const aData = { eventId, selectionId: makeFancy(eventId, data.id), runnerId: data.id, provider: 'tiger', name: data.name, type: 'Fancy' };
        fancyController.setAutoFancy(aData).then(resp => {
            console.log(resp, data.id, 'tiger');
        });
    });
}