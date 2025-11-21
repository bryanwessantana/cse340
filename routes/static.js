const express = require('express');
const router = express.Router();
const utilities = require("../utilities")
const baseController = require("../controllers/baseController")

router.use(express.static("public"));

router.get(
  "/trigger-error",
  utilities.handleErrors(baseController.causeError)
)

module.exports = router;