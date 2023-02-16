const { STATUS } = require("../constants/Config");
const redisdb = require("../constants/redis-db");

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
        let sFancy = await getMultiMarkets(ids,'Fancy-','-sky')
        let s3Fancy = await getMultiMarkets(ids,'Fancy-','-sk')
        let sky2 = await getMultiMarkets(ids,'Fancy-','-sky2')
        let fancy ={"sky":sFancy,"sky3":s3Fancy,"sky2":sky2}
        let sBM =await getMultiMarkets(ids,'BM-','-sky')
        let s3BM = await getMultiMarkets(ids,'BM-','-sk')
        let bm = {"sky":sBM,"sky3":s3BM}
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
        let getdata =data != null ? Array.isArray(data) ? result.push(data[0]):result.push(data): []
    }    
    return result;
}