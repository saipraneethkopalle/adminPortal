const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Config = require("../constants/Config");

router.use(function(req, res, next) {
    const authHeader = req.headers.authorization
    
    const token = authHeader
    if (token == null) return res.sendStatus(Config.STATUS.UNAUTHORIZED);  
    jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
  
      if (err) return res.sendStatus(Config.STATUS.UNAUTHORIZED)
      user = user  
      next()
    })
  });

  module.exports = router;