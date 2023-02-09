var express = require("express");
var router = express.Router();
var adminController = require("../controller/adminController");
router.post('/addWhitelistWebsite',adminController.addWhitelistWebsite);
router.get('/getWhitelistWebsite/:website_id',adminController.getWhitelistWebsite);
router.get('/getAllWebsite',adminController.getAllWebsite);
router.get('/removeWhitelistWebsite/:website_id',adminController.removeWhitelistWebsite);
router.delete('/deleteWebsite/:name',adminController.removeWebsite);
router.post('/adduser',adminController.adduser);
router.get('/getUsers',adminController.getUsers);
router.post('/updateUser',adminController.updateUser);
router.post('/getLoginStatus',adminController.getLoginStatus);
router.post('/addDefaultSettings',adminController.addDefaultSettings);
router.get('/getDefaultSettings',adminController.getDefaultSettings);
router.post('/addMatch',adminController.addMatch);
router.post('/updateMatchStatus',adminController.updateMatchStatus);
router.get('/removeMatch/:event_id',adminController.removeMatch);
router.get('/getEvents',adminController.getEvents);
router.post('/getEventsBySportName',adminController.getEventsBySportName);
router.get('/getMatches',adminController.getMatches);
router.get('/getMatchBySports/:sports',adminController.getMatchBySports);
router.get('/getLatestData/:sports',adminController.getLatestData);
router.post('/updateProvider',adminController.updateProvider);
router.get('/getRemovedData',adminController.getRemovedData);
router.get('/getRemovedDataBySportsName/:sport',adminController.getRemovedDataBySName);
router.patch('/removeMatchBySports/:eventId/:sport',adminController.removeMatchFromRedis);
router.patch('/rollBackMatch/:eventId',adminController.rollBack);
router.post('/updateUrl',adminController.updateUrl);
router.get('/getEventDetail/:eventId',adminController.getEventDetail);
router.put('/updateMatch',adminController.updateFinalStatus);
router.post('/addSetLimit',adminController.addSetLimit);
router.get('/getSetLimit/:eventId',adminController.getSetLimit);
router.post('/inactiveFancy',adminController.removeFancy);
router.get('/getInactiveFancy',adminController.getInactiveFancy);
router.post('/activeFancy',adminController.activeFancy);
router.post('/closeFancy',adminController.closeFancy);
router.post('/rollbackFancy',adminController.rollbackFancy);
router.post('/removeFancy',adminController.removeFancyData);
router.post('/changeactiveAll',adminController.changeactiveAll);
router.post('/getLayBackDetailsByMarketId',adminController.getLayBackDetails);
router.get('/fetchMatches',adminController.fetchMatches);
router.get('/fetchOdds/:marketId',adminController.fetchOdds);
router.get('/getMatchesActivities/:eventId',adminController.getMatchesActivities)
router.get('/getFancy/:eventId',adminController.getFancy);
router.post("/setFancyStatus", adminController.setFancyStatus);
router.get("/getFancyByStatus", adminController.getFancyByStatus);
router.get("/getProviderFancy",adminController.getProviderFancy);
router.post('/getAllActive',adminController.getAllActiveData);
router.get('/getFancyActivities/:eventId/:selectionId',adminController.getFancyActivities);
router.get("/getActiveFancyByEvent/:eventId", adminController.getActiveFancyByEvent);
router.get("/getOdds/:eventid",adminController.getOdds);
router.get("/getMultipleOdds/:eventid",adminController.getMultiOdds);
router.get("/getBookMaker/:marketId",adminController.getBookM);
router.post("/setProcess", adminController.setProcess);
router.get("/getProcess", adminController.getProcess);
router.put('/updateMatchSettings',adminController.updateMatchSettings)
router.get('/getMatchSettings',adminController.getMatchSettings)
router.get('/health',(req,res)=>{return res.send("Api working fine")}); // add new apis above
router.post('/addApiWhitelist',adminController.addApiWhiteList)
router.get('/getApiWhitelist',adminController.getApiWhiteList);
router.put('/updateApiWhitelist',adminController.updateApiWhiteList)
module.exports = router;