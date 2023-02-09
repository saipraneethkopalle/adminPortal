const { STATUS } = require("../constants/Config");
const redisdb = require("../constants/redis-db");

exports.getDFancyBM = async(req,res)=>{
    try{
        let dFancy = JSON.parse(await redisdb.GetRedis(""))
        let dBM = JSON.parse(await redisdb.GetRedis(""))
        return res.status(STATUS.OK).send(err)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}
exports.getSFancyBM = async(req,res)=>{
    try{
        let dFancy = JSON.parse(await redisdb.GetRedis(""))
        let dBM = JSON.parse(await redisdb.GetRedis(""))
        return res.status(STATUS.OK).send(err)
    }catch(err){
        return res.status(STATUS.BAD_REQUEST).send(err)
    }
}