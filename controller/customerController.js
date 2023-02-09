const { STATUS } = require("../constants/Config");
const redisdb = require("../constants/redis-db");

exports.getDFancyBM = async(req,res)=>{
    try{
        let dFancy = JSON.parse(await redisdb.GetRedis('Fancy-' + req.params.marketId + '-diamond'))
        let dBM = JSON.parse(await redisdb.GetRedis('BM-' + req.params.marketId + '-diamond'))
        let result = {
            "message":"Diamond Result fetched",
            "data":{"Fancy":dFancy,"BookMaker":dBM}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getSFancyBM = async(req,res)=>{
    try{
        let sFancy = JSON.parse(await redisdb.GetRedis('Fancy-' + req.params.marketId + '-sky'))
        let sBM = JSON.parse(await redisdb.GetRedis('BM-' + req.params.marketId + '-sky'))
        let result = {
            "message":"Sky Result fetched",
            "data":{"Fancy":sFancy,"BookMaker":sBM}
        }
        return res.status(STATUS.OK).send(result)
        return res.status(STATUS.OK).send(err)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getWFancyBM = async(req,res)=>{
    try{
        let sFancy = JSON.parse(await redisdb.GetRedis('Fancy-' + req.params.marketId + '-world'))
        let sBM = JSON.parse(await redisdb.GetRedis('BM-' + req.params.marketId + '-world'))
        let result = {
            "message":"World Result fetched",
            "data":{"Fancy":sFancy,"BookMaker":sBM}
        }
        return res.status(STATUS.OK).send(result)
        return res.status(STATUS.OK).send(err)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}

exports.getRyan = async(req,res)=>{
    try{
        let ryandata = JSON.parse(await redisdb.get('Odds-' + key + '-ryan'))
        let result = {
            "message":"Ryan details fetched",
            "data":{"ryan":ryandata}
        }
        return res.status(STATUS.OK).send(result)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getTiger = async(req,res)=>{
    try{
        let tigerdata = JSON.parse(await redisdb.get('Odds-' + key + '-tiger'))
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
        let betfairdata = JSON.parse(await redisdb.get('Odds-' + key + '-betfair'))
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
        let virtualdata = JSON.parse(await redisdb.get("virtualMatches"));
        // virtualdata = JSON.parse(virtualdata);
        return res.status(STATUS.OK).send({
            message:"Success",
            data:virtualdata,
            status:1
        })

    }catch(err) {

    }
}