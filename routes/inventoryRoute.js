// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")

// Route to build inventory by classification view (Public)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build single vehicle view (Public)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

/* ******************************************
 * Management Routes (Protected)
 * *******************************************/
router.get("/", 
  utilities.checkLogin, 
  utilities.checkAccountType, // Added Task 2
  utilities.handleErrors(invController.buildManagementView)
)

// Route to add-classification form (GET)
router.get("/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType, // Added Task 2
    utilities.handleErrors(invController.buildAddClassification)
)

// Route to build add-inventory view
router.get(
    "/add-vehicle",
    utilities.checkLogin,
    utilities.checkAccountType, // Added Task 2
    utilities.handleErrors(invController.buildAddVehicle)
)

// Route to add-classification form submission (POST)
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType, // Added Task 2
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

// Route to add vehicle to inventory (POST)
router.post(
    "/add-vehicle",
    utilities.checkLogin,
    utilities.checkAccountType, // Added Task 2
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router