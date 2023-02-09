const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
// api for customer use
router.get('/getDFancyBM/:marketId',customerController.getDFancyBM);
router.get('/getSFancyBM/:marketId',customerController.getSFancyBM);
router.get('/getWFancyBM/:marketId',customerController.getWFancyBM);
router.get('/getRyan/:marketId',customerController.getRyan);
router.get('/getTiger/:marketId',customerController.getTiger);
router.get('/getBetfair/:marketId',customerController.getBetfair);
router.get('/getVirtualMatches',customerController.getVirtualMatches);

module.exports = router;