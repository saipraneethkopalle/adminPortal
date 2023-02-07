var jwt = require("jsonwebtoken");

function generateAccessToken(data) {
    return jwt.sign(data, process.env.TOKEN_SECRET,"Stack", {expiresIn: "3h"});
  }

module.exports = generateAccessToken;