/* ******************************************
 * Needed Resources
 *******************************************/
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ******************************************
 * Account Management Default View
 *******************************************/
// Route to deliver the account management view (e.g., /account/)
router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

/* ******************************************
 * Deliver Login View
 *******************************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ******************************************
 * Deliver Registration View
 *******************************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister))


/* ******************************************
 * Process Login Request
 *******************************************/
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(), // Login validation rules
  regValidate.checkLoginData, // Validation check function
  utilities.handleErrors(accountController.accountLogin) // Controller function to process login
)

/* ******************************************
 * Process Registration
 *******************************************/
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router