var express = require("express");
var loginRouter = express.Router();
var beforeAuthController = require("../controller/logincontroller");
loginRouter.post('/createUser',beforeAuthController.createAdmin);
loginRouter.post('/login',beforeAuthController.login);
loginRouter.get('/getScoreMatches',beforeAuthController.getAllData);

module.exports = loginRouter;