// Needed Resources  
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")

// Route to build inventory by classification view (Public)
router.get(
    "/type/:classificationId", 
    utilities.handleErrors(invController.buildByClassificationId.bind(invController))
);

// Route to build single vehicle view (Public)
router.get(
    "/detail/:invId", 
    utilities.handleErrors(invController.buildByInvId.bind(invController))
);

/* ******************************************
 * Management Routes (Protected)
 * *******************************************/
router.get("/", 
  utilities.checkLogin, 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

// Route to add-classification form (GET)
router.get("/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification)
)

// Route to build add-inventory view
router.get(
    "/add-inventory-form",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddVehicle)
)

// Route to add-classification form submission (POST)
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

// Route to add vehicle to inventory (POST)
router.post(
    "/add-inventory-form",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to get inventory in JSON format
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

/* ******************************************
 * Inventory Delete Routes (Protected)
 * *******************************************/

// Route to build delete confirmation view (GET)
router.get(
    "/delete/:invId",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteView)
)

// Route to handle inventory deletion (POST)
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)

// Route to handle classification deletion (POST) (NEW)
router.post(
    "/delete-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteClassification)
)

module.exports = router