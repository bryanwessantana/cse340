const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const { handleErrors } = require("../utilities")
const invValidate = require("../utilities/inv-validation")

router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

router.get("/detail/:invId", handleErrors(invController.buildByInvId));

router.get("/", handleErrors(invController.buildManagementView));

router.get("/add-classification", handleErrors(invController.buildAddClassification))

router.get(
  "/add-vehicle",
  handleErrors(invController.buildAddVehicle)
)

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  handleErrors(invController.addClassification)
)

router.post(
  "/add-vehicle",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  handleErrors(invController.addInventory)
)

module.exports = router