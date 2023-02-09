const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
// api for customer use
router.get('/getDFancyBM',customerController.getDFancyBM);
router.get('/getSFancyBM',customerController.getSFancyBM);
router.get('/getWFancyBM',customerController.getWFancyBM);
router.get('/getRyan',customerController.getRyan);
router.get('/getTiger',customerController.getTiger);
router.get('/getBetfair',customerController.getBetfair);
router.get('/getVirtualMatches',customerController.getVirtualMatches);