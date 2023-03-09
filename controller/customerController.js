const { STATUS } = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const axios = require("axios");
const matchService = require("../services/matchService");
const moment = require("moment");

exports.getDFancyBM = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',')
        // console.log("m",ids);
        let dFancy = await getMultiMarkets(ids, 'Fancy-', '-diamond')
        let data = { "Fancy": [], "BookMaker": [] }        
	for (let d of dFancy) {
	    if(d.data?.t3!=null && d.data.t3.length > 0){
	    data.Fancy.push(...d.data?.t3);
	    }
	   if(d.data?.t2 != null && d.data.t2.length > 0){
            data.BookMaker.push(...d.data?.t2);
	   }
        }	
        let result = {
            "message": "Diamond Result fetched",
            "data": data
        }
        return res.status(STATUS.OK).send(result)
    } catch (err) {
        // console.log("err", err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getSFancyBM = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',')  
        const data = [getMultiMarkets(ids, 'Fancy-', '-sky'),getMultiMarkets(ids, 'BM-', '-sky'),getMultiMarkets(ids, 'Odds-', '-sky')]
        const result = await Promise.allSettled(data)
        // console.log("res",result[0].value);
        let skyf=result[0].value.length > 0?result[0].value:[]
	//skyf[0] = skyf[0]?.filter(resp => {
        //    if (resp.status != '18' && resp.status != '1' && resp.status != '14') {
        //        return resp
        //    }
        //})
        let finalResult = {
            "message": "Sky Result fetched",
            "data": { "Fancy": {"sky": skyf}, "BookMaker": {"sky": result[1].value.length > 0?result[1].value:[]}, "Odds": { "sky":result[2].value.length > 0?result[2].value:[]} }
        }
        return res.status(STATUS.OK).send(finalResult)
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getS3FancyBM = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',')
        const data = [getMultiMarkets(ids, 'Fancy-', '-sk'), getMultiMarkets(ids, 'BM-', '-sk')]
        const result = await Promise.allSettled(data)
        let finalResult = {
            "message": "Sky Result fetched",
            "data": { "Fancy": { "sky3": result[0].value.length > 0?result[0].value:[] }, "BookMaker": { "sky3": result[1].value.length > 0?result[1].value:[] } }
        }
        return res.status(STATUS.OK).send(finalResult)
    } catch (err) {
        console.log(err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getSkyFancyBM = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',')
        const data = [getMultiMarkets(ids, 'Fancy-', '-sky'), getMultiMarkets(ids, 'BM-', '-sk')]
        const result = await Promise.allSettled(data)
	    let skyf =result[0].value.length > 0?result[0].value:[]
	    // console.log("skyf",skyf.length)
	    skyf=skyf?.filter(resp=>{
                if(resp.status != '18' && resp.status != '1' && resp.status != '14'){
                        return resp
                }
                })
        // console.log("sky",skyf.length);
        let finalResult = {
            "message": "Sky Result fetched",
            "data": { "Fancy": skyf, "BookMaker": result[1].value.length > 0 ? result[1].value:[]}
        }
        return res.status(STATUS.OK).send(finalResult)
    } catch (err) {
        console.log(err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getWFancyBM = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',')    
        const data =await Promise.allSettled([getMultiMarkets(ids, 'Fancy-', '-world'),getMultiMarkets(ids, 'BM-', '-world')])
        let result = {
            "message": "World Result fetched",
            "data": { "Fancy": data[0].value.length > 0 ? data[0].value:[], "BookMaker": data[1].value.length > 0 ? data[1].value:[]}
        }
        return res.status(STATUS.OK).send(result)
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}

exports.getRyan = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',');
        // console.log("ids",ids,"length",ids.length);
        let ryandata = await getMultiMarkets(ids, 'Odds-', '-ryan')
	console.log("ry",ryandata);
        let result = {
            "message": "Ryan details fetched",
            "data": { "ryan": ryandata.length > 0 ? ryandata:[] }
        }
        return res.status(STATUS.OK).send(result)
    } catch (err) {
        console.log("testing", err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getTiger = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',');
        let tigerdata = await getMultiMarkets(ids, 'Odds-', '-tiger')
        let result = {
            "message": "Tiger details fetched",
            "data": { "tiger": tigerdata.length > 0 ? tigerdata:[] }
        }
        return res.status(STATUS.OK).send(result)
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getBetfair = async (req, res) => {
    try {
        let ids = (req.params.marketId).split(',');
        let betfairdata = await getMultiMarkets(ids, 'Odds-', '-betfair')
        let result = {
            "message": "Betfair details fetched",
            "data": { "betfair": betfairdata.length > 0 ? betfairdata:[]}
        }
        return res.status(STATUS.OK).send(result)
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getVirtualMatches = async (req, res) => {
    try {
        // console.log("virtual");
        let virtualdata = JSON.parse(await redisdb.GetRedis("virtualMatches"));
        // virtualdata = JSON.parse(virtualdata);
        return res.status(STATUS.OK).send({
            message: "Virtual details fetched",
            data: virtualdata,
        })
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}

const getMultiMarkets = async (arr, first, last) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {

        let data = JSON.parse(await redisdb.GetRedis(first + arr[i] + last))
	//console.log("data",data)
	//data=data != null && data.length > 0 ? data[0]:[]
        //let getdata = data != null ? Array.isArray(data) ? result.push(data) : result.push(data) : []
	let getdata = data != null ? Array.isArray(data) ? data : data : []
	if(last == '-sky' || last=='-sk'){
	getdata = getdata.filter(resp => {
            if (resp.status != '18' && resp.status != '1' && resp.status != '14') {
                return resp
            }})
	
	result.push(...getdata);
	}else{
	if(Array.isArray(getdata) && getdata.length > 0){
	result.push(...getdata);
	}else{
	if(!Array.isArray(getdata)){
	result.push(getdata);
	}
	}
	}
    await new Promise((resolve) => setImmediate(async() => {
            resolve();
    }));            
    }
    return result
}

exports.customMatches = async (req, res) => {
    try {
        let finalResult = await matchService.getEventDataBySportName({ isActive: true, isResult: false });
        finalResult = finalResult.map(dt => ({ ...dt, unixDate: moment(dt.openDate, 'MM/DD/YYYY hh:mm:ss A').unix() })).sort((a, b) => a.unixDate - b.unixDate);

        return res.status(STATUS.OK).send({
            message: "Match details fetched",
            data: finalResult,
        })
    } catch (err) {
        console.log("err", err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
