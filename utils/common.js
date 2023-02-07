var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret  = require('../constants/CONST').secretKey;
function commonService(){

}
commonService.encryptPassword=async  (password)=> {

    let salt = await bcrypt.genSalt(12);
   //  console.log("the salt is ",password,salt);
    let encrypt = await bcrypt.hash(password,salt)
   //  console.log("i am printing encrypt is ",encrypt)
    return encrypt;
 }
commonService.comparePassword=async(password,encPassword)=> {
   try {
      // console.log(password,encPassword);
      let decrypt = await bcrypt.compare(password,encPassword);
      return decrypt;
   } catch(err) {
      return err;

   }
   
 }
 commonService.generateToken = async (payload)=> {
   try{
      let token =await jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:"2h" });
      return token;
   }catch(err) {
      return err;

   }
 }

 module.exports = commonService;
 