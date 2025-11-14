// Needed Resources
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view (Task 1)
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to intentionally trigger a 500 error (Task 3)
router.get("/error", invController.throwError);

module.exports = router;