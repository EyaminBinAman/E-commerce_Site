const express = require("express");

const {
  getBaseInfo,
  getHealthStatus,
} = require("../../controllers/base.controller");

const router = express.Router();

router.get("/", getBaseInfo);
router.get("/health", getHealthStatus);

module.exports = router;
