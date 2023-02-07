const { STATUS } = require("../constants/Config");
const user = require("../models/user");
const match = require("../models/match");
const common = require('../utils/common');
const axios = require('axios');
const redisdb = require("../constants/redis-db");

exports.login = async (req, res) => {
  try {
    // console.log(req.body);
    // let dbConnection = await db();
    let userExists = await user.findOne({ username: req.body.username })
    if (userExists) {
      let verifyPassword = await common.comparePassword(
        userExists.slag,
        req.body.password
      );
      if (verifyPassword) {
      let payload = {
        username: userExists.username
      };
      let token = await common.generateToken(payload);
      // console.log("i am printing token",token);
      if (token) {
        // await user.updateOne({ username: req.body.username }, { $set: { isLoggedIn: true } })
        // let result = {"username":userExists.username,"isActive":userExists.isActive,"level":userExists.level,"isLoggedIn":userExists.isLoggedIn}
        return res.status(STATUS.OK).send({
          status: 1,
          "id":userExists._id,
          "username":userExists.username,"isActive":userExists.isActive,"level":userExists.level,
          token: token,
          expiresIn: 7200
        });
      }
    }else{
	return res.status(STATUS.BAD_REQUEST).send({
        status: 0,
        message: "incorrect credentials",
      });
    }
    } else {
      return res.status(STATUS.BAD_REQUEST).send({
        status: 0,
        message: "invalid credentials",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(STATUS.BAD_REQUEST).send({
      status: 0,
      error: err.message,
    });
  }
};
exports.createAdmin = async (req, res) => {
  try {
    let hashPassword = await common.encryptPassword(req.body.password);
    // console.log(hashPassword);
    let result = await user.find().lean();    
    if (result.length > 0) {
        req.body.level = 3;
    }
    else {
        req.body.level = 1;
    }
    if (hashPassword) {
      req.body.slag = req.body.password;
      req.body.password = hashPassword;
      req.body.isActive = true;
      req.body.createdAt = (new Date()).toISOString();
      let createAdmin = new user(req.body);
      createAdmin.save();

      return res.status(STATUS.OK).send({ status: 1, data: createAdmin });
    }
  } catch (err) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send({ status: 0, error: err.message });
  }
};
exports.getAllData = async (req, res) => {
  try {
    let data = await match.find({isActive:true,isResult:false}).lean();
    return res.status(STATUS.OK).send(data);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
};

