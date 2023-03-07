const { STATUS } = require("../constants/Config");
const redisdb = require("../constants/redis-db");
const axios = require("axios");
const matchService = require("../services/matchService");
const moment = require("moment");

exports.getDFancyBM = async(req,res)=>{
    try{
        let ids = (req.params.marketId).split(',')
        // console.log("m",ids);
        let dFancy = await getMultiMarkets(ids,'Fancy-','-diamond')
        let data ={"Fancy":[],"BookMaker":[]}
        for(let d of dFancy){
            data.Fancy.push(d.data?.t3);
            data.BookMaker.push(d.data?.t2);
        }
        let result = {
            "message":"Diamond Result fetched",
            "data":data
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        console.log("err",err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getSFancyBM = async(req,res)=>{
    try{ 
        let ids = (req.params.marketId).split(',')
	let skyOdds = await getMultiMarkets(ids,'Odds-','-sky')
        let sFancy = await getMultiMarkets(ids,'Fancy-','-sky')
        //let s3Fancy = await getMultiMarkets(ids,'Fancy-','-sk')
       // let sky2 = await getMultiMarkets(ids,'Fancy-','-sky2')
	//   console.log("sky3===",s3Fancy);
		sFancy = sFancy[0]?.filter(resp=>{
		if(resp.status != '18' && resp.status != '1' && resp.status != '14'){
			return resp
		}
		})
        let fancy ={"sky":sFancy}
	//   console.log("sky count==",fancy.sky.length)
        let sBM =await getMultiMarkets(ids,'BM-','-sky')
       // let s3BM = await getMultiMarkets(ids,'BM-','-sk')
        let bm = {"sky":sBM}
        let result = {
            "message":"Sky Result fetched",
            "data":{"Fancy":fancy,"BookMaker":bm,"Odds":skyOdds}
	    //"data":{"Fancy":fancy}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getS3FancyBM = async(req,res)=>{
    try{
        let ids = (req.params.marketId).split(',')
        //let skyOdds = await getMultiMarkets(ids,'Odds-','-sky')
        //let sFancy = await getMultiMarkets(ids,'Fancy-','-sky')
        let s3Fancy = await getMultiMarkets(ids,'Fancy-','-sk')
       // let sky2 = await getMultiMarkets(ids,'Fancy-','-sky2')
        //   console.log("sky3===",s3Fancy);
        let fancy ={"sky3":s3Fancy}
       // let sBM =await getMultiMarkets(ids,'BM-','-sky')
        let s3BM = await getMultiMarkets(ids,'BM-','-sk')
        let bm = {"sky3":s3BM}
        let result = {
            "message":"Sky Result fetched",
            "data":{"Fancy":fancy,"BookMaker":bm}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getWFancyBM = async(req,res)=>{
    try{
        let ids = (req.params.marketId).split(',')
        let sFancy = await getMultiMarkets(ids,'Fancy-','-world')     
        let sBM = await getMultiMarkets(ids,'BM-','-world')     
        let result = {
            "message":"World Result fetched",
            "data":{"Fancy":sFancy,"BookMaker":sBM}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}

exports.getRyan = async(req,res)=>{
    try{
        let ids = (req.params.marketId).split(',');
        // console.log("ids",ids,"length",ids.length);
        let ryandata = await getMultiMarkets(ids,'Odds-','-ryan')     
        let result = {
            "message":"Ryan details fetched",
            "data":{"ryan":ryandata}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        console.log("testing",err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getTiger = async(req,res)=>{
    try{
        let ids = (req.params.marketId).split(',');
        let tigerdata = await getMultiMarkets(ids,'Odds-','-tiger')
        let result = {
            "message":"Tiger details fetched",
            "data":{"tiger":tigerdata}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getBetfair = async(req,res)=>{
    try{
        let ids = (req.params.marketId).split(',');
        let betfairdata = await getMultiMarkets(ids,'Odds-','-betfair')
        let result = {
            "message":"Betfair details fetched",
            "data":{"betfair":betfairdata}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getVirtualMatches = async(req,res)=>{
    try {
        // console.log("virtual");
        let virtualdata = JSON.parse(await redisdb.GetRedis("virtualMatches"));
        // virtualdata = JSON.parse(virtualdata);
        return res.status(STATUS.OK).send({
            message:"Virtual details fetched",
            data:virtualdata,
        })
    }catch(err) {        
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}

const getMultiMarkets = async(arr,first,last)=>{
    let result=[];
    for(let i=0;i<arr.length;i++){
        let data =JSON.parse(await redisdb.GetRedis(first + arr[i] + last))
	  
        let getdata =data != null ? Array.isArray(data) ? result.push(data):result.push(data): []
    }    
    return result;
}

exports.customMatches = async(req,res)=>{
    try{
        let finalResult = await matchService.getEventDataBySportName({isActive:true,isResult:false});
        finalResult = finalResult.map(dt => ({ ...dt, unixDate: moment(dt.openDate, 'MM/DD/YYYY hh:mm:ss A').unix() })).sort((a, b) => a.unixDate - b.unixDate);
        
        return res.status(STATUS.OK).send({
            message:"Match details fetched",
            data:finalResult,
        })
    }catch(err){
        console.log("err",err);
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
