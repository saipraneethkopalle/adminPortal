const redis = require('redis');
var client = redis.createClient();
client.connect().then(async() => {
//    console.log("connect to",await client.set("start","Redis Live"))
 //   console.log("working",await client.get("start"))
  }).catch((err)=>{console.log(err);});

var redisService = function(){}

redisService.SetRedis = async(key,value)=>{
    return await client.set(key,value);
}
redisService.SetRedisEx = async(key,value,time)=>{
    // return await client.set(key,value,'EX',time);
    await client.set(key,value);
    return await client.expire(key,time);
}
redisService.GetRedis = async(key)=>{
    try {
        // console.log(await client.get(key))
        return await client.get(key);
    } catch(err) {
        console.log(err)

    }
   
}
redisService.Flushdb =async()=>{
    await client.flushDb();
    client.connect().then(async() => {
   //     console.log("connect to",await client.set("start","Redis Live"))
     //   console.log("working",await client.get("start"))
      }).catch((err)=>{console.log(err);});
}

redisService.DelRedis = async(key)=>{
    return await client.del(key);
}
redisService.GetKeys = async(key)=>{
    return await client.keys(key);
}
redisService.ZincrRedis = async(arg1,arg2,arg3)=>{
    return await client.zIncrBy(arg1,arg2,arg3);
}
redisService.Zrange = async(arg1,arg2,arg3,arg4)=>{
    return await client.zRange(arg1,arg2,arg3,arg4);
}
module.exports = redisService;
